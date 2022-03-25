const Pagination = ({ items, pageSize, onPageChange, currentPage }) => {
  const { Button } = ReactBootstrap;
  if (items.data != undefined) items = items.data;
  if (items.length <= 1) return null;
  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num);
  let firstLast = false;
  if (num > 1) firstLast = true;


  const list = pages.map(page => {
    return (
      <li key={page} onClick={onPageChange} className="page-item">
        <label className="page-link" style={{border: 1+`px solid #0275d8`}}>{page}</label>
      </li>
    );
  });
  const select = pages.map(page => {
    return (
      <option key={page} id={page} value={page}>{page}</option>
    )
  });
  return (
    <nav style={{marginTop: 10+`px`}}>
      <ul className="pagination justify-content-center">
        {
          firstLast && 
          <li key="first" onClick={onPageChange} className="page-item">
            <label className="page-link" style={{border: 1+`px solid #0275d8`}}>First</label>
          </li>
        }
        <select key="pageSelect" onChange={onPageChange} className="page-item" style={{width:50+`px`, height: 38+`px`}}>{select}</select>
        {
          firstLast && 
          <li key="last" onClick={onPageChange} className="page-item">
            <label className="page-link" style={{border: 1+`px solid #0275d8`}}>Last</label>
          </li>
        }
      </ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);
  const [selected, setSelected] = useState(0);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState(0);
  const [hasDetails, setHasDetails] = useState(true);
  const [hasIcons, setHasIcons] = useState(true);
  const [city, setCity] = useState(false);
  const pageSize = 9;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://sports.api.decathlon.com/sports",
    []
  );
  const showInfo = (e, item) => {
    setSelected(item.id);
  }
  const handlePageChange = e => {
    let value = e.target.value;
    if (value === undefined) value = e.target.textContent;
    if (value === 'First') {
      value = 1;
    } else if (value === 'Last') {
      value = Math.ceil(page.length / pageSize) ;
    }
    setCurrentPage(Number(value));
  };
  let page = data;
  if (data.data != undefined) page = data.data; 
  page.sort(function(a, b) {
    if (a.attributes.name < b.attributes.name) { return -1; }
    if (a.attributes.name > b.attributes.name) { return 1; }
    return 0;
  });
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
  }
  const list = page.map((item, index) => {
    let active = '';
    if (item.id === selected) active = 'active';
    return (
      <li key={`list${item.id}`} data-toggle="tooltip" data-placement="right" title={item.attributes.description} className={`list-group-item ${active}`} onClick={(e) => {showInfo(e, item)}}>
        <label>{item.attributes.name}</label>
      </li>
    );
  });
  const info = page.map((item, index) => {
    let icon = false;
    if (item.attributes.icon != undefined) icon = true;
    if (item.id === selected) {
      return (
        <div key={`info${item.id}`} id={`info${item.id}`} className="info">
          <div className="card border-primary mb-3">
            <div className="card-header">
            <h5 className="card-title">{item.attributes.name}</h5>
            </div>
            {icon && <img id="image" src={item.attributes.icon} alt={item.attributes.name} className="icon"/>}
            <div className="card-body text-primary">
              <p className="card-text">{item.attributes.description}</p>
            </div>
          </div>
        </div>
      )
    }
  });
  const filterDetails = (e) => {
    setHasDetails(e.target.checked);
    filterItems();
  }
  const filterIcons = (e) => {
    setHasIcons(e.target.checked);
    filterItems();
  }
  const filterItems = () => {
    let url = "https://sports.api.decathlon.com/sports/";
    let city = cities.filter((city) => city.rank === document.getElementById('citySelect').value);
    let longitude = city[0].longitude;
    let latitude = city[0].latitude;
    if (longitude != 0 || latitude != 0) {
      let temp = `recommendations/geolocation`;
      const elSearch = document.getElementById('search');
      if (elSearch != null) {
        if (elSearch.value.length > 0) temp = `search/${elSearch.value}`;
      }
      url += `${temp}?coordinates=${longitude},${latitude}`;
    }
    url += `&source=decathlon`;
    const elDetails = document.getElementById('hasDetails');
    if (elDetails != null) url += `&details=${String(elDetails.checked)}`;
    const elIcons = document.getElementById('hasIcons');
    if (elIcons != null) url += `&has_icon=${String(elIcons.checked)}`;
    doFetch(url);
    event.preventDefault();
  };
  const area = cities.map(city => {
    return (
      <option key={city.rank} id={city.rank} value={city.rank}>{city.city}</option>
    )
  });

  function getLocation(e) {
    let city = cities.filter((city) => city.rank === e.target.value);
    setCity(true);
    filterItems();
  }
  const checkIfCitySel = () => {
    const element = document.getElementById('citySelect');
    if (element != null) {
      return (element.vale === 0);
    } else {
      return false;
    }
  }

  return (
    <Fragment>
      <div className="nav">
        <select key="citySelect" id="citySelect" onChange={(e) => getLocation(e)} style={{width:318+`px`, height: 38+`px`, marginBottom: 5+`px`}}>
          {area}
        </select>
      </div>
      {city ?
        <form onSubmit={filterItems}>
          <div className="nav">
            <div className="navbutton">
              <input id="search" type="text" value={query} onChange={event => setQuery(event.target.value)} style={{width: 255+`px`}}/>
              <button type="submit" className="btn btn-primary btn-sm" style={{marginLeft: 4+`px`, marginTop: -5+`px`}}>Search</button>
            </div>
          </div>
          <div className="nav">
            <div className="navslider">
              <label style={{marginTop: -2+`px`}}>Has Details</label>
              <label className="switch" style={{marginLeft: 6+`px`}}>
                <input id={'hasDetails'} type="checkbox" checked={hasDetails} onChange={(e)=>{filterDetails(e)}}/>
                <span className="slider round"></span>
              </label>
            </div>
            <div className="navslider">
              <label style={{marginLeft: -2+`px`}}>HasIcon</label>
              <label className="switch" style={{marginLeft: 6+`px`}}>
                <input id={'hasIcons'} type="checkbox" checked={hasIcons} onChange={(e)=>{filterIcons(e)}}/>
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </form>
        :
        <></>
      }

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div className="group">
          <div className="list">
            <ul className="list-group">
              {list}
            </ul>
          </div>
          <div id="info" className="info">
            {info}
          </div>
        </div>
      )}
      <Pagination
        items={data}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      ></Pagination>
    </Fragment>
  );
}

// ========================================
ReactDOM.render(<App />, document.getElementById("root"));
