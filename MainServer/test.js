const { DB, FindNullError, UserTable, WebSite } = require('./app/My_db_plugin/JSON_db');
var db = new DB('./app/storage/db/');
db.findOneUserByIdOrNull({ userId: '2de93047-5ae6-4305-b287-6e1e92e60f58' }).then((res) => {
    if (res != null) {
        let newWeb = new WebSite({
            hash: "hash",
            test: "testRes",
            numbers: [5, 9]
        });
        res.addNewWebSite(newWeb);
        res.save().then((res) => {
            console.log(newWeb.id);
        }).catch(err => {
            console.log(err);
        });;
    }else{
        db.createNewUserTable('2de93047-5ae6-4305-b287-6e1e92e60f58').then((res2) => {
            let newWeb2 = new WebSite({
                hash: "hash",
                test: "testRes",
                numbers: [5, 9]
            });
            res2.addNewWebSite(newWeb2);
            res2.save().then((res) => {
                console.log(res2.fileUser.id_user);
            }).catch(err => {
                console.log(err);
            });
        });

    }
})
    .catch(err => {
        if (err instanceof FindNullError) {
            console.log(err);
            return;
        }
        console.log(err);
    });;