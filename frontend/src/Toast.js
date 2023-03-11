import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";



class Toast extends React.Component{


    render() {

        return (
            <div className={"toast-container position-fixed bottom-0 end-0 p-3"}>
                <div id="liveToast" className={`toast ${this.props.toast}`} role={"alert"} aria-live={"assertive"} aria-atomic={"true"}>
                    <div className={"toast-header"}>
                        <strong className={"me-auto"}>Info</strong>
                        {/*<small>11 mins ago</small>*/}
                        <button type={"button"} className={"btn-close"} data-bs-dismiss={"toast"} aria-label={"Close"} onClick={this.props.closeToast}></button>
                    </div>
                    <div className={"toast-body text-bg-dark"}>
                        {this.props.toastMessage}
                    </div>
                </div>
            </div>
        );
    }
}

export default Toast;