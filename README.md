

# endpoints


`/`

Method: GET
***response params***
`Welcome to UltraLearn's API`

### Authentication Endpoints

`/signup` 

Method : POST
***request params***
```
{
    "fullName": "",
    "username": "",
    "email": "",
    "password": "",
}
```
 
***response params***

```
success: 200
{
    "status": true,
    "message": "Signup success! Please login."
}
```

`/login` 

Method : POST
***request params***
```
{
    "email": "",
    "password": ""
}
```
 
***response params***

```
success: 200
{
    "status": true,
    {
        token, 
        user: { 
            _id, 
            email, 
            fullName, 
            username, 
            imgId
            }
     }
}
```

`/logout`

Method: GET
***response params***
```
success: 200
{
    "status": true,
    "message": "Signout success!"
}
```

### User Endpoints

`/users`

Method: GET
***response params***
```
success: 200
{
    "status": true,
    users
}
```

`/ul/:username` `/user/:username`

Method: GET
***response params***
```
success: 200
{
    "status": true,
    user
}
```

`/ul/:username`  `/user/:username`

Method : PUT
***request params***
```
{
    token,
    {
        "fullName": "",
        "username": "",
        "email": "",
        "password": "",
        "dateOfBirth: "",
        "bio": "",
        "skillInterests": "",
        "gender": "",
        "location": ""
    }
}
```
 
***response params***

```
success: 200
{
    "status": true,
    user
}
```
`/user/:username`

Method: DELETE
***response params***
```
success: 200
{
    "status": true,
    "message": "Your account has been deleted successfully!"
}
```
`/user/findpeople/:username`

Method: GET
***response params***
```
success: 200
{
    "status": true,
    users
}
```

`/user/:userid/follow` 

Method : GET
***request params***
```
Request Header: token
```
 
***response params***

```
success: 200
{
    "status": true,
    user
}
```
`/user/:userid/unfollow` 

Method : GET
***request params***
```
{
    Request Header: token

}
```
 
***response params***

```
success: 200
{
    "status": true,
    user
}
```

### Post Endpoints

`/post/new/:username`

Method : POST
***request params***
```
{
    username,
    token,
    post: {
        "body": "",
        "postImgId: ""
    }
}
```
***response params***
```
success: 200
{
    "status": true,
    post
}
```
`/posts`

Method : GET
***response params***
```
success: 200
{
    "status": true,
    posts
}
```
`/post/:postId`

Method : GET
***response params***
```
success: 200
{
    "status": true,
    post
}
```
`/posts/by/:username`

Method : GET
***response params***
```
success: 200
{
    "status": true,
    posts
}
```
`/post/:postId`

Method : PUT
***request params***
```
{
    token,
    post: {
        "body": "",
        "postImgId: ""
    }
}
```
***response params***
```
success: 200
{
    "status": true,
    post
}
```
`/post/:postId`

Method : DELETE
***response params***
```
success: 200
{
    "status": true,
    "message": "Post succesfully deleted!"
}
```
`/post/like` 

Method : PUT
***request params***
```
{
    token,
    userId,
    postId
}
```
 
***response params***

```
success: 200
{
    "status": true,
    post
}
```
`/post/unlike` 

Method : PUT
***request params***
```
{
    token,
    userId,
    postId
}
```
 
***response params***

```
success: 200
{
    "status": true,
    post
}
```
`/post/comment` 

Method : PUT
***request params***
```
{
    token,
    userId,
    postId,
    comment: {
        text: ""
    }
}
```
 
***response params***

```
success: 200
{
    "status": true,
    post
}
```
`/post/uncomment`

Method : PUT
***request params***
```
{
    token,
    userId,
    postId,
    comment: {
        text: ""
    }
}
```
 
***response params***

```
success: 200
{
    "status": true,
    post
}
```
