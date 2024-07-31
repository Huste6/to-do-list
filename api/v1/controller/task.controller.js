const Task = require("../model/task.model")
const paginationHelper = require("../../../helper/paganition")
const SearchHelper = require("../../../helper/search")

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status
    }
    
    // pagination
    const CountTask = await Task.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItem: 2
    }, req.query, CountTask);
    // end pagination
    
    //search
    const ObjectSearch = SearchHelper(req.query);
    if (ObjectSearch.regex) {
        find.title = ObjectSearch.regex
    }
    //end search

    //sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    //end sort
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.json(tasks);
}

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json(tasks);
    }catch(error){
        res.json("Not found!");
    }
}

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req,res) => {
    try{
        const id = req.params.id;
        const status = req.body.status;
        await Task.updateOne({
            _id: id
        },{
            status: status
        })
    
        res.json({
            code:200,
            message:"Cập nhật trạng thái thành công"
        });
    }catch(error){
        res.json({
            code:400,
            message:"Không tồn tại"
        });
    }
    
}

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req,res) => {
    try{
        const { ids,key , value } = req.body;
        switch(key){
            case "status":
                await Task.updateMany(
                    {
                        _id: {$in: ids}
                    },{
                        status: value
                    }
                )
                res.json({
                    code:200,
                    message:"Cập nhật trạng thái thành công"
                });
                break; 
            default:
                res.json({
                    code:400,
                    message:"Không tồn tại"
                });
        }
        
    }catch(error){
        res.json({
            code:400,
            message:"Không tồn tại"
        });
    }
}

//[POST] /api/v1/tasks/change-multi
module.exports.create = async (req,res) => {
    try{
        const task = new Task(req.body);
        const data = await task.save();
        res.json({
            code:200,
            message:"Tao thành công",
            data: data
        });
    }catch(error){
        res.json({
            code:400,
            message:"Lỗi"
        });
    }
}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req,res) => {
    try{
        const id = req.params.id;
        
        await Task.updateOne({_id: id}, req.body);
        
        res.json({
            code:200,
            message:"Cập nhật thành công"
        });
    }catch(error){
        res.json({
            code:400,
            message:"Lỗi"
        });
    }
}