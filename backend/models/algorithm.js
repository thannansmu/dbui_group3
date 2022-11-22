const knex = require('../database/knex');
const USERS_TABLE = 'users';
const PREFERENCES_TABLE = 'preferences';
   const fetchMatches = async (email) => {
       console.log(email);
       const query = knex(USERS_TABLE).where({ email: email });
       const user = await query;
       const query2 = knex(PREFERENCES_TABLE).where({ email: email });
       const preferences = await query2;
       const query3 = knex(USERS_TABLE);
       const allUsers = await query3;
       //console.log(users)
       //console.log(preferences)
       //var usersObj = JSON.parse(users);
       //console.log(typeof user);
       //const prefObj = JSON.parse(preferences);
       //console.log(usersObj);
       //console.log(prefObj);
       //console.log(user);
       //console.log(user[0].password);
       //console.log(allUsers);
       //console.log(allUsers[1]);

       var matches;

       if (user[0].desired_gender == "Either"){
           const emailQuery = knex.select('email').from(USERS_TABLE);
           matches = await emailQuery;
       } else {
           const emailQuery = knex.select('email').from(USERS_TABLE).where({gender: user[0].desired_gender});
           matches = await emailQuery;
       }

       //console.log(matches);

       const matchesPref  = [];
       const origQuery = knex(PREFERENCES_TABLE).where({email: user[0].email});
       origPref = await origQuery;
       matchesPref.push(origPref);

       for (const match of matches){
            if (user[0].email != match.email){
                const prefQuery = knex(PREFERENCES_TABLE).where({email: match.email});
                matchPref = await prefQuery;
                //console.log(matchPref);
                matchesPref.push(matchPref);
            }
       }

       //console.log(matchesPref[0]);
       //console.log(matchesPref[1]);

       const prefArrays = prefArray(matchesPref);

       const sortedList = [];
       for (const person of prefArrays){
            if (prefArrays[0] != person){
                sortedList.push({email: person.email, value: correlation(prefArrays[0].valArray, person.valArray)})
            }
       }

       sortedList.sort((a, b) => a.value - b.value);

       console.log(sortedList);

       

       console.log(prefArrays);

       const finalSortedUserList = [];

       for (const person of sortedList){
           const finalQuery = knex(USERS_TABLE).where({ email: person.email });
           const user = await finalQuery;
           finalSortedUserList.push(user[0]);
       }

       //var combine = Object.assign(users, preferences);
       return finalSortedUserList;
   }

   function prefArray(matchesPref){
        const prefs  = [];

        let hashMap = new Map([
            ["Do Everything Together", 1],["Friend", 2],["Coexist", 3],
            ["Morning Seeking Morning", 1],["Morning Seeking Both", 2],["Night Seeking Both", 3],["Night Seeking Night", 4],
            ["Once Per Week", 1],["Three Per Week", 2],["Five Per Weeks", 3],["Every day", 4],
            ["Hang out", 1], ["Relax", 2], ["Study", 3], ["Rarely Use Space", 4],
            ["Quiet", 1], ["Some Noise", 2], ["Any Noise", 3], ["Much Noise", 4],
            ["Smoke Daily", 5], ["Smoke Occasionally", 7], ["No Smoke", 9],
            ["Very Clean", 1], ["Clean", 2], ["Indifferent", 3], ["Messy", 4],
            ["Cold", 1], ["Fairly Cold", 2], ["Fairly Warm", 3], ["Warm", 4],
            ["Share Everything", 1], ["Share Occasionally", 2], ["No Share", 3],
            ["Have Pet", 1], ["Fine With Pet", 2], ["No Pet", 3]
       ]);

        for (const outerArray of matchesPref){

            for (const person of outerArray){

                const userPrefs  = [];
                console.log(person);

                for (const attribute in person){

                    console.log(person[attribute]);
                    if (hashMap.has(person[attribute])){
                        userPrefs.push(hashMap.get(person[attribute]));
                        console.log(hashMap.get(person[attribute]));
                    } else if (attribute != 'email') userPrefs.push(0);
                } 
                prefs.push({email: person.email, valArray: userPrefs});
            }
        }

        return prefs;
   }

   function correlation(xs, ys) {
    //TODO: check here that arrays are not null, of the same length etc

    let sx = 0.0;
    let sy = 0.0;
    let sxx = 0.0;
    let syy = 0.0;
    let sxy = 0.0;

    let n = xs.length;

    for(let i = 0; i < n; ++i) {
      let x = xs[i];
      let y = ys[i];

      sx += x;
      sy += y;
      sxx += x * x;
      syy += y * y;
      sxy += x * y;
    }

    // covariation
    let cov = sxy / n - sx * sy / n / n;
    // standard error of x
    let sigmax = Math.sqrt(sxx / n -  sx * sx / n / n);
    // standard error of y
    let sigmay = Math.sqrt(syy / n -  sy * sy / n / n);

    // correlation is just a normalized covariation
    return cov / sigmax / sigmay;
  }

module.exports = {
    fetchMatches
 }
