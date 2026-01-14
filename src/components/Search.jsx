
const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <div>
            <img src="search.svg" alt="search"></img>
            <input
            type="text"
            placeholder="Search Movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ></input>
        </div>
    </div>  
  )
}


export default Search