module.exports=(objectPagination,query,CountRecord)=>{
    if(query.page){
        objectPagination.currentPage=parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.limitItem;
    const totalPage = Math.ceil(CountRecord/objectPagination.limitItem);
    objectPagination.totalPage=totalPage;
    return objectPagination;
}