import { Form } from "react-bootstrap";

function FilterBar({ onFilterClick }){
    return(<>
        <Form>
            <button className="custom-outline-btn" type="button" onClick={onFilterClick || (() => {})}>
                Filter
            </button>
        </Form>
    </>);
}

export default FilterBar