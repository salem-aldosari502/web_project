import { Form } from "react-bootstrap";


function SearchBar({searchValue, setSearchValue, catigory=(()=>{String || []}) }) {
    function handleSubmit(e){
        e.preventDefault();
        alert("Searching");
    }
    return (
        <Form className="d-flex" style={{width: "70%"}} onSubmit={handleSubmit}>
            <Form.Control
                type="search"
                placeholder={`search for ${catigory}...`}
                className="me-2"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="custom-outline-btn" type="submit">
                Search
            </button>
        </Form>
    );
}
export default SearchBar;