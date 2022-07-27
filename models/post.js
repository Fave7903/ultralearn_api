module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    }, 
    body: {
      type: Sequelize.STRING,
      allowNull: false
    },
    postedBy: {
      type: Sequelize.STRING, 
    },
    postImgId: {
      type: Sequelize.STRING
    },
    created: {
      type: Sequelize.DATE
    },
    updated: {
      type: Sequelize.DATE
    }
  }
    ,
    { 
      timestamps: false 
    });
  return Post;
};



// FOR PERMISSION
// permission
// id, name, description, status(0,1), 
// 1, "delete_user", "Can delete any user on site", 1
// 2, "ban_user", "Can ban any user on site", 1
// 3, "create_admin", "Can create admin user on site", 1
// 4, "delete_admin", "Can create admin user on site", 1

// user
// id, name
// 1, seye 
// 2, pius
// 3, angel

// user_permision
// id, user_id, permision_id
// 1, 1, 2
// 2, 1, 3

// verify("delete_user")






//FOR FOLLOWING/FOLLOWERS
// followers
// id, user_id, follower_id
// 1, 1, 2
// 2, 1, 3
// 3, 3, 1

// user
// id, name
// 1, seye 
// 2, pius
// 3, angel




//FOR INTEREST
// interest
// id, name, active(0,1)
// 1, sex , 1
// 2, game, 1
// 3, Bbn , 1
// 4, volleyball, 1

// user
// id, name
// 1, seye 

// user_interest
// id, user_id, interest_id
// 1, 1, 1
// 1, 1, 3
// 1, 1, 4

//https://select2.org/getting-started/basic-usage


// password
// md5(pass)

// // users
// id, first_name, last_name, username, email, password, active(0,1) default=1, created
// 1, "seye", "elijah", "pius", "favour@example.com", "83487437bfy8dhsdjygu", 1, "2022-09-01"
// 2, "adebola", "angel", "luke", "john@example.com", "83487437bfy8dhsdjygu", 1, "2022-09-01"

// //  post
// id, title, slug, text, user_id,  parent_id, created
// 1, "what am i?","what-am-i", "I am a boy", 2,  0, "2022-09-01"

// // comment
// id, text, parent_type( post, image,pdf) post, parent_id, user_id, created
// 2, "are you a boy really?","post", 1,1, "2022-09-01"
// 3, "nice picture","image", 2,12, "2022-09-01"























