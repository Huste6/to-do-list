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