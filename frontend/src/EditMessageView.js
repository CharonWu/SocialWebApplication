import React from "react";
import url from "./URLUtility";

class EditMessageView extends React.Component{

    constructor(props) {
        super(props);
        this.state={text: ""};
        this.save = this.save.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
    }

    componentDidMount() {
        // console.log(this.props.id+" "+this.props.user+" "+this.props.data);
        this.setState({text: this.props.data});
    }

    save(){
        this.props.editPost(this.props.id, this.state.text, "post", -2);
    }

    handleDataChange(e){
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="modal fade" id={`staticBackdrop-edit-message`+`${this.props.id}`} data-bs-backdrop="static" data-bs-keyboard="false"
                 tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content bg-dark">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit</h1>
                            <button type="button" className="btn-close bg-body" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className={'container'}>
                                <div className={'row'}>
                                    <textarea name={'text'} value={this.state.text} onChange={this.handleDataChange}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={this.save}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditMessageView;