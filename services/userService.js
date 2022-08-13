const models = require("../models")


//userid isa the id of the user to be followed
//followerid id the id of the user that want to follow
// returns false or return user profile of user that was followed
async function followable(followedid, followerid){
    try{
        const followed = await models.user.findOne({where: {id: followedid}});
        const follower = await models.user.findOne({where: {id: followerid}});
        if( followed.id === follower.id){
            return false
        } else {
            return followed
        }
        } catch (e){
            //log details
            return false;
    }

}

async function isFollowed(followedid, followerid){
    try{
        const row = await models.follower.findOne({where: {userId: followedid, followerId: followerid}});
        return ( row)?true: false
        } catch (e){
            //log details
            return false;
    }

}


async function addFollower(followedid, followerid){
    try{
        const user = await models.follower.create({
            userId: followedid, 
            followerId: followerid
        }
            );

         return (user )? user :false
        } catch (e){
            //log details
            return false;
    }

}


async function doUnFollower(followedid, followerid){
    try{
        const user = await models.follower.destroy({where:{
            userId: followedid,
            followerId: followerid
            }}
            );
 
         return (user )? true :false
        } catch (e){
            //log details
            return false;
    }

}


module.exports = {
    followable,
    isFollowed,
    addFollower,
    doUnFollower
}