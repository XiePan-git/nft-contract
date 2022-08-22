const ethers = require('ethers');
var express = require('express');
const sdk = require('api')('@alchemy-docs/v1.0#3i0fg2al6qodvru');
// 解决跨区域问题
// 导入中间件 cors
const cors = require('cors');
var app =express();
app.use(cors());
app.all("*",function(req,res,next){
 res.header("Acess-Control-Allow-Origin","*");
 next();
})
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "<-- ALCHEMY APP API KEY -->",
  network: Network.ETH_MAINNET,
};
// const ethers = require('web3');
const fs = require('fs');
const mysql = require('./utils/mysql.js');

const provider = new ethers.providers.JsonRpcProvider('https://bsctestapi.terminet.io/rpc');

const GoldDAONode = fs.readFileSync('./contracts/Grounding.json','utf8')
let GoldDAONodeAddress ="0x580b60441f7d5498cac5f92196dc7b88428ce081";


app.listen(8888,function(){
  console.log('正在启动8888....');
})


// 查询全部
app.get('/api/getData', (req, res) => {
  sdk.server('https://eth-mainnet.g.alchemy.com/nft/v2');
sdk.getNFTs({
  owner: '0xf1aaBD530C11eB9385e790d98EbB2B793A3d8165',
  withMetadata: 'false',
  apiKey: '0IDcg86RD7VwZZx3LOG3-pvBPOnTqC5t',
  
})
  .then(res => console.log(res["ownedNfts"]))
  .catch(err => console.error(err));
  console.log("这个是getData接口")
  res.send("顶顶顶顶")
  // const sql = 'SELECT * FROM t_coach where status != 1';
  // const params = req.query;
  // conn.query(sql, params, (err, result) => {
  //   jsonWrite(res, result, err)
  // })
})
let overriddes = {
  gasLimit: 300000,
  gasPrice: ethers.utils.parseUnits('10', 'gwei')
}

let contract = new ethers.Contract(
  GoldDAONodeAddress,
  GoldDAONode,
  provider
);
let block={
  fromBlock:0,
  toBlock:1000
  ,address:'0x580b60441f7d5498cac5f92196dc7b88428ce081'
};
(async () => {
  console.log("哈哈哈")
  await provider.getLogs(
    block).then((logList =>{
    console.log(logList)
  }))
  contract.on("Buy", (from, to, nft, tokenId, token, price, event) => {
    // 在值变化的时候被调用
    console.log("Buy: "+event.blockNumber);
    let time = new Date();
    mysql.syncQuery('insert into transfers(froms,tos,nft,nft_id,token,price,time) values (?)', [[from, to, nft, tokenId, token, price, time]])
    mysql.syncQuery('delete from ground where nft = ? and nft_id = ?',[[nft,tokenId]])
  });
  contract.on("Sell", (from, nft, tokenId, price, event) => {
    // 在值变化的时候被调用
    console.log("Sell: "+event.blockNumber);
    let time = new Date();
    mysql.syncQuery('insert into ground values (?)',[[from,nft,tokenId,price,time]])
  });
  contract.on("Withdraw", (nft,tokenId, event) => {
    // 在值变化的时候被调用
    console.log("Withdraw: "+event.blockNumber);
    mysql.syncQuery('delete from ground where nft = ? and nft_id = ?',[nft,tokenId])
    // res.json(true)
  });
  contract.on("SetBNBPrice", (nft, tokenId, price, event) => {
    // 在值变化的时候被调用
    console.log("SetBNBPrice: "+event.blockNumber);
    price = price/1
    tokenId = tokenId/1
    mysql.syncQuery('update ground set price = ? where nft = ? and nft_id = ?',[price,nft,tokenId])
    // res.json(true)
  });
  contract.on("Acquisition", async (owner, id, nft, price, event) => {
    // 在值变化的时候被调用
    console.log("Acquisition: "+event.blockNumber);
    let time = new Date();
    mysql.syncQuery('insert into acquisition values (?)', [[owner, id, nft, price, time]])
    // res.json(true)
  });
  contract.on("Sale", async (id, from, to, nft, tokenId, token, price, event) => {
    // 在值变化的时候被调用
    console.log("Sale: "+event.blockNumber);
    let time = new Date();
    mysql.syncQuery('delete from acquisition where owner = ? and ids = ?', [to,id])
    mysql.syncQuery('insert into transfers(froms,tos,nft,nft_id,token,price,time) values (?)', [[from, to, nft, tokenId, token, price, time]])
    // res.json(true)
  });
})()

(async () => {
  console.log("ggg")
})()

// [
// 	{
// 		"anonymous": false,
// 		"inputs": [
// 			{
// 				"indexed": false,
// 				"internalType": "address",
// 				"name": "u",
// 				"type": "address"
// 			}
// 		],
// 		"name": "TTT",
// 		"type": "event"
// 	},
// 	{
// 		"inputs": [],
// 		"name": "retrieve",
// 		"outputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "",
// 				"type": "uint256"
// 			}
// 		],
// 		"stateMutability": "view",
// 		"type": "function"
// 	},
// 	{
// 		"inputs": [
// 			{
// 				"internalType": "uint256",
// 				"name": "num",
// 				"type": "uint256"
// 			}
// 		],
// 		"name": "store",
// 		"outputs": [],
// 		"stateMutability": "nonpayable",
// 		"type": "function"
// 	}
// ]