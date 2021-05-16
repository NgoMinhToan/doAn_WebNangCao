module.exports = {
    index: (req, res) => {
        let success = req.flash('success')
        let msg = req.flash('msg')


 
        console.log({data: {...req.session.passport.user, ...req.user._doc}, flash: {success, msg}})
        return res.render('main', {data: {...req.session.passport.user, ...req.user._doc}, flash: {success, msg}})
    },
}