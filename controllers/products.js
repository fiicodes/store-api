const Product=require('../models/product')

const getAllProductsStatic =async (req,res)=>{
    const search='a'
    const products=await Product.find({price:{$gt:30}}).sort('name').select('name').limit(10).skip(5)


    res.status(200).json({products, nbHits:products.length})


}

const getAllProducts =async (req,res)=>{
    const { featured,company,name,sort ,fields,numericFilters} =req.query
    const queryObject  ={}
    if (featured){
        queryObject.featured=featured==='true'?true:false
    }
    if (company){
        queryObject.company=company
    }
    if (name){
        queryObject.name={ $regex:name,$options:'i'}
    }


    let result=  Product.find(queryObject)
    if(sort){
    const sortList=sort.split(',').join(' ');
    result=result.sort(sortList)
    }
    else{
        result=result.sort('createdAt')

    }
    if(fields){
        const fieldList=fields.split(',').join(" ")
        result=result.select(fieldList)
    }
    const page=Number(req.query.page)|| 1
    const limit =Number(req.query.limit)|| 10
    const skip=(page -1)*limit
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '<':'$lt',
            '<=':'$lte',
            '=':'$eq'
        }
        const regEx=/\b(<|>|<=|>=|=)\b/g

        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        const options=['price','rating'];
        filters=filters.split(',').forEach((item)=>{
            const [field,operator,value]= item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)}
              }
        })
    }

    console.log(queryObject)
    result=Product.find(queryObject)

    const products=await result
    res.status(200).json({products,
    nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic
}