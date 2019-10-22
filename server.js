const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const express = require('express')
const session = require('express-session')
const sqlite3 = require('sqlite3')


const db = new sqlite3.Database('./database.sqlite')

const app = express()

const PORT = process.env.PORT || 4000

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())
app.use(session({
  'secret': '123'
}))

var sess;

app.post('/login',(req,res,next)=>{

      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const password = req.body.password;

    if (!firstname | !password | !lastname) {
    return res.sendStatus(400);
}
    const sql = 'SELECT * FROM users WHERE firstname=$firstname AND lastname=$lastname AND password=$password'
    const values = {
      $firstname : firstname,
      $lastname: lastname,
      $password: password
      }
    db.all(sql, values, (error, user)=>{
      if (error) {
          next(error)

      } else{
      sess = req.session
      sess.check = user[0].id
      res.status(200).send({user:user})
      }
    })
})

app.put('/setdays',(req,res,next)=>{
  const userid = req.body.userid;
  const daysOfVacation = req.body.daysOfVacation;
db.run(`UPDATE users SET vacationdays=${daysOfVacation} WHERE id = ${userid}`, error=>{
  if (error) {
      next(error)
    }
  })
})

app.get('/:userid', (req, res,next)=>{
  const userid = Number(req.params.userid);
  const sql = 'SELECT * FROM users WHERE id = $userid'
    const values ={
    $userid:userid
  }

 if (userid == sess.check){
  db.get(sql,values, (error, user)=>{
    if (error) {
        next(error)
    } else{
      db.all(`SELECT SUM(vacation) FROM vacations WHERE userid = ${req.params.userid}`,(error, summ)=>{
        res.status(200).send({user:user, summ:summ})
      })
      }
  })
 }
})

app.get('/vacations/:userid',(req,res,next)=>{
  console.log(req.params.userid)
  db.all(`SELECT * FROM vacations WHERE userid = ${req.params.userid}`, (error, vacations)=>{
    if (error) {
        next(error)
    } else{
      res.status(200).send({vacations:vacations})
  }
    }
  )
})


app.post('/vacations',(req,res,next)=>{
  const userid = req.body.userid;
  const dateFrom = req.body.datefrom;
  const dateTo = req.body.dateto;
  const vacation = req.body.vacation;
  const description = req.body.description;
  const fromyear = req.body.fromyear;

  const sql = 'INSERT INTO vacations (userid,fromdate,todate,vacation,description,fromyear) VALUES ($userid,$datefrom,$dateto,$vacation,$description,$fromyear)'
  const values = {
    $userid:userid,
    $datefrom:dateFrom,
    $dateto:dateTo,
    $vacation:vacation,
    $description:description,
    $fromyear:fromyear
  }
  db.run(sql,values,(error,vacation)=>{
    if (error) {
        next(error)
        console.log('error')
    } else{
      db.get(`SELECT vacationdays FROM users WHERE id = ${userid}`, (error, vacationdays)=>{
      let vac = vacationdays.vacationdays - req.body.vacation;
      db.run(`UPDATE users SET vacationdays=${vac} WHERE id = ${userid}`);
      db.all(`SELECT * FROM vacations WHERE userid = ${userid}`, (error, vacations)=>{
        res.status(200).send({vacations:vacations,vac:vac})
      })
    })
  }
})
})

app.post('/delete',(req,res,next)=>{
  const id = req.body.id;
  const days = req.body.days;
  const userid = req.body.userid;
  db.run(`DELETE FROM vacations WHERE id = ${id}`,error=>{
    if (error) {
        next(error)
        console.log('error')
    } else{
      db.get(`SELECT vacationdays FROM users WHERE id = ${userid}`, (error, vacationdays)=>{
        let vac = vacationdays.vacationdays + days;
        db.run(`UPDATE users SET vacationdays=${vac} WHERE id = ${userid}`)
        db.all(`SELECT * FROM vacations WHERE userid = ${userid}`, (error, vacations)=>{
          res.status(200).send({vacations:vacations, vac:vac})
        })
     })
  }})
})

app.put('/update',(req,res,next)=>{
  const userid = req.body.userid;
  const dateFrom = req.body.datefrom;
  const dateTo = req.body.dateto;
  const vacation = req.body.vacation;
  const prewVacationDays = req.body.prewVacationDays;
  const description = req.body.description;
  const vacationId = req.body.vacationId;
  const fromyear = req.body.fromyear;

  const sql = 'UPDATE vacations SET fromdate = $fromdate, todate=$todate, vacation=$vacation, description = $description, fromyear=$fromyear WHERE id =$vacationid';
  const values = {
    $fromdate:dateFrom,
    $todate:dateTo,
    $vacation:vacation,
    $description:description,
    $vacationid:vacationId,
    $fromyear:fromyear
  }
  db.run(sql,values, error=>{
    if (error) {
        next(error)
        console.log('error')
    } else{
      db.get(`SELECT vacationdays FROM users WHERE id = ${userid}`, (error, vacationdays)=>{
        let vac = vacationdays.vacationdays + prewVacationDays-vacation;
        db.run(`UPDATE users SET vacationdays=${vac} WHERE id = ${userid}`)
        db.all(`SELECT * FROM vacations WHERE userid = ${userid}`, (error, vacations)=>{
          res.status(200).send({vacations:vacations, vac:vac})
        })
      })
    }
  })

})

app.post('/restorePassword',(req,res,next)=>{
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

})

app.get('/logout',(req,res,next)=>{
  req.session.destroy()
})

app.use(errorhandler())

app.listen(PORT, ()=>{console.log(`the server is running on ${PORT}`)})
