import { Form } from "react-bootstrap";

function FilterBar(){
    return(<>
        <Form>
            <button className="custom-outline-btn" type="submit">
                Filter
            </button>
        </Form>
    </>);
}

export default FilterBar