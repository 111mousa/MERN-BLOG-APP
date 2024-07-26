import "./pagination.css";

const Pagination = ({ pages , currentPage , setCurrentPage }) => {

    const generatedPages = Array.from({length: pages}, (_, i) => i + 1);

    return ( 
        <div className="pagination">
            <button 
            className="page previous"
            onClick={()=>setCurrentPage(prev=>prev-1)}
            disabled={currentPage === 1}
            >
                Previous
            </button>
            {generatedPages.map(page => (
                <div 
                onClick={()=>setCurrentPage(page)} 
                key={page} 
                className={currentPage===page?"page active":"page"}
                >
                    {page}
                </div>
            ))}
            <button 
            className="page next"
            disabled={currentPage === pages}
            onClick={()=>setCurrentPage(prev=>prev+1)}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;