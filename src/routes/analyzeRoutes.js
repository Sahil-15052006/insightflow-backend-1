const express = require('express')
const router = express.Router()

const structureDataIntoColumns=(data,keyNames)=>{
  const structuredData = {};
  keyNames.forEach((key) => {
    structuredData[key] = data.map((object) => object[key]);
  });
  return structuredData
}

const idenifyKeyDataType=(data)=>{
  const keyTypes = {};

  for (let i=0 ; i<data.length; i++ ) {
    for (let key in data[i]){
      const value = data[i][key]
      if (value === null || value === undefined) continue;
      if (typeof value === "boolean") keyTypes[key] = "boolean";
      else if (typeof value === "number") keyTypes[key] = "number";
      else if (!isNaN(Date.parse(value))) keyTypes[key] = "date";
      else if (typeof value === "string") keyTypes[key] = "string";

    }
  }
  
  return keyTypes
}

const groupKeysByTypes=(keyTypes)=>{
  
  const keysByType={
    numeric:[],
    boolean:[],
    date:[],
    categorical:[],
  }

  for (let key in keyTypes) {
      if (keyTypes[key]==="number") keysByType.numeric.push(key)
      if (keyTypes[key]==="boolean") keysByType.boolean.push(key)
      if (keyTypes[key]==="string") keysByType.categorical.push(key)
      if (keyTypes[key]==="date") keysByType.date.push(key)
  }

  return keysByType
}

router.post('/analyze',(req,res)=>{
    try {
        
        const {data} = req.body
        if(!data) return res.json({message:"data not found "})
        const keyNames = data.map(obj=>Object.keys(obj))[0]

        const finalData={}
        finalData.structuredData = structureDataIntoColumns(data,keyNames)
        const keyTypes = idenifyKeyDataType(data)
        finalData.keyTypesGroups = groupKeysByTypes(keyTypes)
        
        res.status(200).json({ finalData })

    } catch(err) {
        res.status(500).json({
            message:"Server Error",
            Error : message.err
        })
    }

})

module.exports = router

    

    