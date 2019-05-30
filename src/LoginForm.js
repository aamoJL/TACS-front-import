import React from "react";

//TODO: remove this when not needed
const user = {
    name: "user",
    password: "password"
}

const style = {
    backgroundColor: 'red',
    maxHeight: '100%',
    maxWidth: '350px'
}

export class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(e){
        const name = e.target.elements.name.value;
        const password = e.target.elements.password.value;

        e.preventDefault();

        // Don't send user info to the server if used hardcoded info
        if(name === user.name && password === user.password){
            this.props.onSubmit({
                logged: true,
                name: name
            });
        }else{
            this.props.onSubmit({
                logged: false,
                name: ""
            });

            
            // This did NOT work !!!!

            // (async() =>{
            //     const asd = await fetch('http://172.20.2.143:3000/user/login',{
            //         method: 'POST',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json',
            //         },
            //         credentials: 'same-origin',
            //         body: JSON.stringify({
            //             name: name,
            //             password: password
            //         })
            //     });
            //     const content = await asd;
            //     console.log(content);
            // })();

            // This worked :)
            // Send login info to the server
            fetch("http://172.20.2.143:3000/user/login",{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    password: password
                })
            })
            .then(res => res.json())
            .then((result) => {
                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error);
                }
            )
        }
    }
    
    render(){
        return(
            <form onSubmit={this.handleLogin} style={style}>
                <label>LOGIN</label>
                <br></br>
                <label>Name:</label>
                <input name="name"/>
                <br></br>
                <label>Password:</label>
                <input type="password" name="password"/>
                <button type="submit">Submit</button>
            </form>
        );
    }
}