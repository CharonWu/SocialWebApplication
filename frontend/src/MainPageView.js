import React from 'react';

import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.bundle.min";
import {useLocation, useNavigate} from "react-router-dom";
import Toast from "./Toast";

import url from "./URLUtility";
import EditMessageView from "./EditMessageView";
import CommentMessageView from "./CommentMessgeView";
import EditCommentView from "./EditCommentView";

class UserControlView extends React.Component{

    constructor(props) {
        super(props);
        this.state={headline:"", avatar:""};
        this.changeInput = this.changeInput.bind(this);
    }

    componentDidMount() {
        const requestOptions = {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        fetch(url+'/avatar', requestOptions).then(response=>response.json()).then(response=>{
            this.setState({avatar: response.avatar});
        })
    }

    changeInput(e){
        this.setState({headline: e.target.value});

    }


    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-6'}>
                        <button className={'btn btn-sm btn-outline-danger'} onClick={this.props.goToLanding}>Log Out</button><br/>
                        <button className={'btn btn-sm btn-outline-primary'} onClick={this.props.goToProfile}>Profile</button>
                    </div>
                    <div className={'col-6'}>
                        <img src={this.state.avatar} className={"img-thumbnail"} alt="..." style={{width: "140px", hieght: "140px"}}/>
                    </div>
                </div>
                <div className={'row'}>
                    <h4>{this.props.userName}</h4>
                </div>
                <div className={'row'}>
                    <p>{this.props.userStatus}</p>
                </div>
                <div className={'row'}>
                    <div className={'col-4'}>
                        <button className={'btn btn-sm btn-outline-primary'} onClick={()=>this.props.changeHeadline(this.state.headline)}>
                            Update
                        </button>
                    </div>
                    <div className={'col-8'} style={{textAlign: "center"}}>
                        <input name={"headline"} style={{width: "100%"}} value={this.state.headline} onChange={this.changeInput}/>
                    </div>
                </div>

            </div>
        );
    }
}

class FollowingAvatar extends React.Component{

    constructor(props) {
        super(props);
        this.state={headline:"", username:"", avatar:""};
    }

    componentDidMount() {
        const requestOptions = {method: 'get',credentials: 'include'};
        fetch(url+'/headline/'+this.props.user, requestOptions).then(response => response.json()).then(response=>this.setState({headline:response.headline}));
        fetch(url+'/avatar/'+this.props.user, requestOptions).then(response => response.json()).then(response=>this.setState({avatar:response.avatar}));
    }

    render() {
        return(
            <div className={'row'}>
                <div className={'col-4'}>
                    <img src={this.state.avatar} className={"img-thumbnail"} alt="..."/>
                    <button name={this.props.user} className={'btn btn-sm btn-outline-danger'} style={{width:"100%", textSizeAdjust:"auto"}} onClick={this.props.unfollow}>unfollow</button>
                </div>
                <div className={'col-8'}>
                    <p>{this.props.user}</p>
                    <p>{this.state.headline}</p>
                </div>
            </div>
        );
    }
}

class FollowingList extends React.Component{

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {

        const followingItems = this.props.following.map((user)=>
            <FollowingAvatar unfollow={this.props.unfollow}  user={user} key={""+user}/>
        )

        return(
            <div className={'container'}>
                <h5>Following Users:</h5>
                {followingItems}
            </div>
        )
    }

}

class Post extends React.Component {

    render() {


        let comments = this.props.data.comments.length===0?<p>No comment here.</p>:this.props.data.comments.map(comment=>{
            return <li key={comment.commentId}>
                <div className={'vstack bg bg-dark border rounded p-1'}>
                    <EditCommentView data={comment.comment} id={this.props.data.pid} commentId={comment.commentId} editPost={this.props.editPost}/>
                    <div className={'hstack'}>
                        <label>{comment.author}</label>
                        {comment.author===this.props.username?<button className={'btn btn-sm btn-outline-info  ms-auto'} data-bs-toggle="modal" data-bs-target={`#edit`+`${comment.commentId}`+`-comment`+`${this.props.data.pid}`}>edit</button>:<div/>}
                    </div>
                    <div className={'border border-light'}>
                        <p>{comment.comment}</p>
                    </div>
                </div>
            </li>
        });


        let body=this.props.data.image===""?<div className={'row'}>
            <div className={'col'}>
                <EditMessageView data={this.props.data.text} id={this.props.data.pid} user={this.props.data.author} editPost={this.props.editPost}/>
                <CommentMessageView data={this.props.data.text} id={this.props.data.pid} user={this.props.data.author} editPost={this.props.editPost}/>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-7'}>
                            {this.props.data.title}
                        </div>
                        <div className={'col-1'}>
                            <button className={'btn btn-sm btn-outline-info'} data-bs-toggle="modal" data-bs-target={"#staticBackdrop-edit-message"+`${this.props.data.pid}`}>Edit</button>
                        </div>
                        <div className={'col-1'}>
                            <button className={'btn btn-sm btn-outline-info'} data-bs-toggle="modal" data-bs-target={"#staticBackdrop-comment-message"+`${this.props.data.pid}`}>Comment</button>
                        </div>
                        <div className={'col-3'}>
                            <a className="btn btn-outline-primary" data-bs-toggle="collapse" href={`#${'post'+this.props.data.pid}`}
                               role="button" aria-expanded="false" aria-controls="collapseExample">
                                Check comments
                            </a>
                        </div>
                    </div>
                    <div className={'row'}>
                        Posted by {this.props.data.author} on {new Date(this.props.data.date).toLocaleDateString()}
                    </div>
                    <div className={'row'}>
                        <p>{this.props.data.text}</p>
                    </div>
                    <div className="collapse row" id={`${'post'+this.props.data.pid}`}>
                        <div className="card card-body bg-secondary">
                            <ul>
                                {comments}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>:<div className={'row'}>
            <EditMessageView data={this.props.data.text} id={this.props.data.pid} user={this.props.data.author} editPost={this.props.editPost}/>
            <CommentMessageView data={this.props.data.text} id={this.props.data.pid} user={this.props.data.author} editPost={this.props.editPost}/>
            <div className={'col-4'}>
                <img src={this.props.data.image} className={"img-thumbnail"} alt="..." style={{width: "200px"}}/>
            </div>
            <div className={'col-8'}>
                <div className={'container'}>
                    <div className={'row'}>
                        <div className={'col-4'}>
                            {this.props.data.title}
                        </div>
                        <div className={'col-2'}>
                            <button className={'btn btn-sm btn-outline-info'} data-bs-toggle="modal" data-bs-target={"#staticBackdrop-edit-message"+`${this.props.data.pid}`}>Edit</button>
                        </div>
                        <div className={'col-2'}>
                            <button className={'btn btn-sm btn-outline-info'} data-bs-toggle="modal" data-bs-target={"#staticBackdrop-comment-message"+`${this.props.data.pid}`}>Comment</button>
                        </div>
                        <div className={'col-4'}>
                            <a className="btn btn-outline-primary" data-bs-toggle="collapse" href={`#${'post'+this.props.data.pid}`}
                               role="button" aria-expanded="false" aria-controls="collapseExample">
                                Check comments
                            </a>
                        </div>
                    </div>
                    <div className={'row'}>
                        Posted by {this.props.data.author} on {new Date(this.props.data.date).toLocaleDateString()}
                    </div>
                    <div className={'row'}>
                        <p>{this.props.data.text}</p>
                    </div>

                    <div className="collapse row" id={`${'post'+this.props.data.pid}`}>
                        <div className="card card-body bg-secondary">
                            <ul>
                                {comments}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>;

        return(
            <tr className={''}>
                <td>
                    <div className={'container'}>
                        {body}
                    </div>
                </td>
            </tr>
        );
    }
}

class PostsView extends React.Component {

    constructor(props) {
        super(props);
        this.state={page: 0};
        this.changePage = this.changePage.bind(this);
    }

    changePage(e){
        this.setState({page: e.target.ariaLabel});
    }

    render() {
        if(this.props.posts.length===0){
            return <h2>No post here.</h2>
        }

        let posts = this.props.posts;
        let postNumber = posts.length;
        let pages = [];
        pages[0]=[];
        let i = 0;
        let j = 0;

        while (i < postNumber) {
            pages[j].push(posts[i]);
            i+=1;

            if (i % 10 === 0&&i<postNumber) {
                j+=1;
                pages.push([]);
            }
        }

        let pageButtons = pages.map((page, index)=>{
            return  <li key={index} className="page-item"><div aria-label={""+index}  className="page-link" onClick={this.changePage}>{index+1}</div></li>

        })

        const postsItem = pages[this.state.page].map((post, index)=>{

                return <Post username={this.props.username} data={post} key={index} editPost={this.props.editPost}/>
            }
        );

        return (
            <div className={'position-relative '}>

                <div style={{overflowY: "scroll", height: '64vh'}}>
                    <table className={'table table-bordered table-striped table-dark'}>
                        <tbody aria-label={'postbody'}>
                        {postsItem}
                        </tbody>
                    </table>
                </div>
                <nav className={'position-absolute bottom-0 start-50 '} aria-label="Page navigation example">
                    <ul className="pagination">
                        {pageButtons}
                    </ul>
                </nav>
            </div>

        );
    }

}

class NewPostView extends React.Component {

    render() {
        return(
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-4 position-relative'} style={{height: "25vh"}}>
                        <h2>Post with an image</h2>
                        <input className={' position-absolute start-0 bottom-0 form-control'} name={"postImage"} type="file" accept="image/*"  onChange={this.props.handleImageChange}/>
                    </div>
                    <div className={'col-6'}><textarea name={'newPostText'} onChange={this.props.handleDataChange} style={{width: "100%", height: "100%"}} value={this.props.newPostText}/></div>
                    <div className={'col-2'}>
                        <button className={'btn btn-sm btn-outline-danger'} onClick={this.props.clearPost}>Clear</button><br/>
                        <button className={'btn btn-sm btn-outline-info'} onClick={this.props.makePost}>Post</button>
                    </div>
                </div>
                <div className={'row'}>
                </div>
            </div>
        );
    }
}


class MainPageView extends React.Component{

    constructor(props) {
        super(props);

        this.state = {username:"default", headline: "Hello, world!",
            posts: [], users: {}, following: [], newPostText:"", postImage:null,
            commentImage: "", newFollowUsername:"", backupPosts:[], searchItem:""};

        this.toProfile = this.toProfile.bind(this);
        this.changeHeadline = this.changeHeadline.bind(this);
        this.toLanding = this.toLanding.bind(this);
        this.makePost = this.makePost.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.editPost = this.editPost.bind(this);
        this.clearPost = this.clearPost.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this)
        this.unfollow = this.unfollow.bind(this);
        this.followNewUser = this.followNewUser.bind(this);
        this.search = this.search.bind(this);
        this.closeToast = this.closeToast.bind(this);
        this.getFeed = this.getFeed.bind(this);
    }

    search(){
        if(this.state.searchItem===""&&this.state.backupPosts.length!==0){
            this.setState({posts: this.state.backupPosts});
        }
        else if(this.state.searchItem!==""){
            let keyItem = this.state.searchItem;
            let filteredPosts = this.state.backupPosts.filter((post)=>{
                let result1 = post.author.indexOf(this.state.searchItem);
                let result2 = post.text.indexOf(this.state.searchItem);
                let result3 = post.comments.findIndex(comment => comment.author.indexOf(this.state.searchItem) > -1 || comment.comment.indexOf(this.state.searchItem) > -1);

                return result1>-1||result2>-1||result3>-1;
            });
            this.setState({posts: filteredPosts});
        }

    }


    followNewUser() {
        const requestOptions = {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        };
        fetch(url + '/following/' + this.state.newFollowUsername, requestOptions).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return 'failed';
            }
        }).then(result=>{
            if (result === 'failed') {
                this.setState({toast: "show"});
            } else {
                this.setState({following: result.following.following})
                this.setState({newFollowUsername: ""})
                this.getFeed();
            }
        });

    }

    unfollow(e){

        let unfollowUser = e.target.name;

        const requestOptions = {method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'};
        fetch(url+'/following/'+unfollowUser, requestOptions).then(response => response.json()).then(response=>{
            this.setState({following:response.following.following});
            this.getFeed();
        });
    }

    handleDataChange(e){
        this.setState({[e.target.name]: e.target.value});

    }

    clearPost(){
        this.setState({newPostText: ""});
    }

    handleImageChange(e){
        this.setState({postImage: e.target.files[0]});
    }

    makePost(){
        if(this.state.newPostText===""){
            return
        }

        if (this.state.postImage !== null) {
            const fd = new FormData();
            fd.append('image', this.state.postImage);

            const requestOptions = {
                method: 'put',
                credentials: 'include',
                body: fd
            };
            fetch(url+'/image', requestOptions).then(response => response.json()).then(response=>{
                let postImageUrl = response.image;
                const requestOp = {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({text:this.state.newPostText, image: postImageUrl})
                };
                fetch(url+'/article', requestOp).then(response => {
                    if( !response.ok ){
                        return 'failed';
                    } else {
                        return response.json();
                    }
                }).then(response=>{
                    if (response === 'failed') {

                    }else{
                        let article = response.articles;
                        let articles = this.state.posts;
                        articles.unshift(article);
                        this.setState({posts: articles});
                        this.setState({backupPosts: articles});
                        this.setState({newPostText: "", commentImage: ""});
                    }
                });
            });
        }else{
            const requestOptions = {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({text:this.state.newPostText})
            };
            fetch(url+'/article', requestOptions).then(response => {
                if( !response.ok ){
                    return 'failed';
                } else {
                    return response.json();
                }
            }).then(response=>{
                if (response === 'failed') {

                }else{
                    let article = response.articles;
                    let articles = this.state.posts;
                    articles.unshift(article);
                    this.setState({posts: articles});
                    this.setState({backupPosts: articles});
                    this.setState({newPostText: "", commentImage: ""});
                }
            });

        }
    }

    editPost(pid, text, type, commentId){
        const requestOptions = {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({type: type, text: text, commentId: commentId})
        };
        fetch(url+'/articles/'+pid, requestOptions).then(response => {
            if( !response.ok ){
                return 'failed';
            } else {
                return response.json();
            }
        }).then(res=>{
            if (res === 'failed') {

            }else{
                let article = res.article;
                let index = this.state.posts.findIndex(post => post.pid === article.pid);
                let newPosts = this.state.backupPosts;
                newPosts[index] = article;
                this.setState({posts: newPosts});
                this.setState({backupPosts: newPosts});
            }
        });
    }

    changeHeadline(newHeadline){
        const requestOptions = {method: 'put',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({headline: newHeadline})};
        fetch(url+'/headline', requestOptions).then(response => response.json()).then(response=>this.setState({headline:response.headline}));
    }

    componentDidMount() {

        this.setState(this.props.location.state);

        const requestOptions = {method: 'get',credentials: 'include'};

        fetch(url+'/headline', requestOptions).then(response => response.json()).then(response=>this.setState({headline:response.headline, username: response.username}));

        fetch(url+'/following', requestOptions).then(response=>response.json()).then(response=>this.setState({following: response.following.following}))

        this.getFeed();


    }

    getFeed(){
        const requestOptions = {method: 'get',credentials: 'include'};

        fetch(url+'/feed', requestOptions).then(response=>response.json()).then(response=>{
            let articles = response.articles;
            articles.sort(function (a,b) {
                return new Date(b.date) - new Date(a.date);
            })
            this.setState({posts: articles});
            this.setState({backupPosts: articles});})
    }


    toProfile(){
        this.props.navigate("/profile", {state:this.state});
    }

    toLanding(){
        const requestOptions = {method: 'put',credentials: 'include'};
        fetch(url+'/logout', requestOptions).then(res=>{
            this.props.navigate("/", {state: this.state});
        });
    }

    closeToast(){
        this.setState({toast:""});
    }

    render() {

        return(
            <div className={'container-fluid'} style={{marginTop: "2%"}}>
                <div className={'row'}>
                    <div className={'col-3'}>
                        <div className={'container-fluid'}>
                            <div className={'row'}>
                                <UserControlView goToLanding={this.toLanding} changeHeadline={this.changeHeadline} userName={this.state.username} userStatus={this.state.headline} goToProfile={this.toProfile}/>
                            </div>
                            <div className={'row'} >
                                <FollowNewUserView handleDataChange={this.handleDataChange} followNewUser={this.followNewUser} newFollowUsername={this.state.newFollowUsername}/>
                            </div>
                            <div className={'row'}  style={{overflowY: "scroll", height: '46vh'}}>
                                <FollowingList unfollow={this.unfollow} following={this.state.following}/>
                            </div>
                        </div>
                    </div>
                    <div className={'col-9'}>
                        <div className={'container'}>
                            <div className={'row'}>
                                <NewPostView handleDataChange={this.handleDataChange} newPostText={this.state.newPostText} makePost={this.makePost} clearPost={this.clearPost} handleImageChange={this.handleImageChange} image={this.state.postImage}  style={{height: '20vh'}}/>
                            </div>
                            <div className={'row'}>
                                <SearchBar handleDataChange={this.handleDataChange} searchItem={this.state.searchItem} search={this.search}/>
                            </div>
                            <div className={'row'} >
                                <PostsView userId={this.state.userId} username={this.state.username} followingUsers={this.state.following} posts={this.state.posts} editPost={this.editPost}/>
                            </div>

                        </div>
                    </div>
                </div>
                <Toast closeToast={this.closeToast} toastMessage={"Cannot follow that user!."} toast={this.state.toast}/>
            </div>
        );
    }

}

class SearchBar extends React.Component{

    render() {
        return (
            <div className={'row'}>
                <div className={'col-9'}>
                    <input aria-label="search-bar" name={'searchItem'} onChange={this.props.handleDataChange} value={this.props.searchItem} style={{width:"100%"}}/>
                </div>
                <div className={'col-3'}>
                    <button className={'btn btn-sm btn-outline-success'} onClick={this.props.search}>search</button>
                </div>
            </div>
        );
    }
}

class FollowNewUserView extends React.Component{
    render() {
        return (
            <div className={'container-fluid bg-dark rounded-3 m-1 p-2 '}>
                <div className={'row'}>
                    <div className={'col-4'}>
                        <button className={'btn btn-sm btn-outline-info'} onClick={this.props.followNewUser}>follow</button>
                    </div>
                    <div className={'col-8'}>
                        <input aria-label={'follow-input'} name={'newFollowUsername'} value={this.props.newFollowUsername} style={{width: "100%"}} onChange={this.props.handleDataChange}/>
                    </div>
                </div>
            </div>
        );
    }
}

export function MainPage(){
    return(
        <MainPageView navigate={useNavigate()} location={useLocation()}/>
    );
}