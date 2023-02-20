const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
const id = 1
const name = "Shoes"
const category = "Clothing"
const image = "Image"
const cost = tokens(1)
const rating = 21 
const stock = 10
describe("Dappazon", () => {
  let dp 
  let deployer ,buyer
  beforeEach(async () =>{
    //console.log(await ethers.getSigners().length)
    [deployer,buyer] = await ethers.getSigners()
    //console.log(deployer.address)
    const dapp = await ethers.getContractFactory("Dappazon")
    dappazon = await dapp.deploy()
  })
  describe("Deploy",()=>{
    it('Sets the owner' ,async()=>{
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })
  describe("Product List",()=>{
    let transction

    beforeEach(async () =>{
      transaction = await dappazon.connect(deployer).productList(
        id,name,category,image,cost,rating,stock
      )
    })
    it('Product Checking' ,async()=>{
      const item = await dappazon.items(1);
      expect(item.id).to.equal(id)
      expect(item.name).to.equal(name)
      expect(item.category).to.equal(category)
      expect(item.image).to.equal(image)
      expect(item.cost).to.equal(cost)
      expect(item.rating).to.equal(rating)
      expect(item.stock).to.equal(stock)
    })
    it('Emit List Event',() =>{
      expect(transction).to.emit(dappazon,"List")
    })
  })
  describe("Product Listing",()=>{
    let transction

    beforeEach(async () =>{
      transaction = await dappazon.connect(deployer).productList(
        id,name,category,image,cost,rating,stock
      )
      await transaction.wait()
      transction = await dappazon.connect(buyer).buy(id, {value: cost})
    })
    it('Update the contract balance', async () =>{
      const result = await ethers.provider.getBalance(dappazon.address) 
      expect(result).to.emit(cost)
    })
    it('Updates buyers order count', async () =>{
      const result = await ethers.provider.getBalance(dappazon.address) 
      expect(result).to.emit(1)
    })
    it('Adds the order', async () =>{
      const order = await dappazon.orders(buyer.address,1);
      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(name)
    })
    it('Emit Buy Event',() =>{
      expect(transction).to.emit(dappazon,"Buy")
    })
  })
  describe("Withdraw fund",()=>{
    let balancebefore

    beforeEach(async () =>{
      let transaction = await dappazon.connect(deployer).productList(
        id,name,category,image,cost,rating,stock
      )
      await transaction.wait()
      //buy a item
      transction = await dappazon.connect(buyer).buy(id, {value: cost})
      await transaction.wait()
      
      //get deployer balance before
      balancebefore = await ethers.provider.getBalance(deployer.address)

      // withdraw
      transaction = await dappazon.connect(deployer).withdraw()
      await transaction.wait()
    })
    it('Updates the owner balance', async () =>{
      const balanceafter = await ethers.provider.getBalance(dappazon.address) 
      expect(balanceafter).to.be.greaterThan(balancebefore)
    })
    it('Updates the contract balance', async () =>{
      const result = await ethers.provider.getBalance(dappazon.address) 
      expect(result).to.equal(0)
    })
  })
})
