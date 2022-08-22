const express = require("express")
const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/evm-utils")

const app = express()
const port = 3000

const MORALIS_API_KEY = "uCHd3GPLaseMWkjecMhCIrEJOZqqGY1GXr9MgWlaHXWwEN6ba5Ta1ndstpRLqYMl"
const address = "0xF3D13Fd70921FFad5E6963a7ef84Bfe706e35c37"
const chain = EvmChain.RINKEBY

async function getDemoData() {
  // Get the nfts
  const nftsBalances = await Moralis.EvmApi.account.getNFTs({
    address,
    chain,
    limit: 10,
  })
  return {nftsBalances}
}

app.get("/demo", async (req, res) => {
  try {

    // Get and return the crypto data
    const data = await getDemoData()
    res.status(200)
    res.json(data)
  } catch (error) {
    // Handle errors
    console.error(error)
    res.status(500)
    res.json({ error: error.message })
  }
})

const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}