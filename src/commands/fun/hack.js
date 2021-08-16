const Command = require('../Command.js');

const ms = require('ms');

const pass = [

'Upstanding_Citizen',

'Scoop_Me_Up',

'Captain_Morgan',

'The_Pretzel',

'Butter_Churner',

'Pubes_Peepshow',

'The_Left-Handed_Stranger',

'The_Abe_Lincoln',

'The_Vibrating_Dryer',

'The_Couch_Potato',

'A.S. Muncher',

'Amanda D. P. Throat',

'Amanda Hump',

'Amanda Lick',

'Amanda Mount',

'Amanda Poker',

'Anita B. Jainow',

'Anita Dick',

'Anita Dickenme',

'Ben N. Syder',

'Ben O. Verbich',

'Ben R. Over',

'Benoit Bawles',

'Berry McCaulkine',

'Betty Drilzzer',

'Betty Humpter',

'Helda Coccen-Mihan',

'Helda Dick',

'Holden A. Pare',

'Holden McGroin',

'Haywood Jablomi',

'Ima Horndawg',

'Ima Reilly Cumming',

'Issac Dick',

'Iva Biggin'

     ];

     

     const us =[

         'BiggDick',

'DickBen',

'DickBlab',

'DickClick',

'DickCute',

'Dickende',

'Dickerje',

'Dickerna',

'Dickerse',

'Dickette',

'DickHandpick',

'DickLaw',

'Dickluti',

'CantFindMyDildo69',

'Fluklyn',

'69th_spermwhale',

'MomToWedThorFriday',

'TheSuburbanErrorist',

'IwasReloading',

'SheWalksInMoonlight',

'aCollectionOfCells',

'FuckOffWillYaGeez',

'WustacheMax',

'Definitelynotarapist',

'MazharFakhar',

'MadameHoussain',

'AlwaysEndWithaSwirl',

'shortbusgangster',

'OnceUponADime',

'OneTonSoup',

'WombRaider',

'ClitYeastWood',

'JuliusSeizure',

'DildoFaggins',

'Pornflakes',

'AlQaholic',

'TestNamePleaseIgnore',

'DildoGaggins',

'MyAnacondaDoes',

'Rumpelforeskin',

'UnfinishedSentenc',

'Heres20BucksKillMe',

'WhistleThuslyTWEET',

'helpdickstuckincow'

         ];

     

module.exports = class HackCommand extends Command {

  constructor(client) {

    super(client, {

      name: 'hack',

      usage: 'hack [user]',

      description: 'Do a Totally Realistic and 100% real hack on The mentioned user',

      type: client.types.FUN,

    });

  }

async run (message, args) {

        const prey = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]) ;

        if (prey.bot) {

            return message.channel.send('People live and learn... but you just live');

        }

        

        const n = pass[Math.floor(Math.random()*pass.length)];

        

                const s = us[Math.floor(Math.random()*us.length)];

                const i = Math.floor(Math.random() * 2486);

        await message.channel.send(`Hacking  ${prey}...`);

      

       message.channel.send('Status: 0%').then((msg) => {

       

       let t = '3s';

       setTimeout(function(){

           msg.edit(`Status 7% : Finding Email of ${prey}...`);

       },ms(t));

       let t2 = '6s';

       setTimeout(function(){

           msg.edit(`Status 10% : Grabbing unmasked Ip of ${prey}...`);

       },ms(t2));

       let t3 = '7s';

       setTimeout(function(){

           msg.edit(`Status 18% : Parsing grabbed packet info...`);

       },ms(t3));

       let t4 = '9s';

       setTimeout(function(){

           msg.edit(`Status 20% : Obtained ${prey} Ip and Email...` );

       },ms(t4));

       let t5 = '10s';

       setTimeout(function(){

           msg.edit(`Status 21% : Establishing Remote connection to ${prey} Ip...`);

       },ms(t5));

       let t6 = '12s';

       setTimeout(function(){

           msg.edit(`Status 26% : Secure Connection Established...`);

       },ms(t6));

         let t7 = '14s';

       setTimeout(function(){

           msg.edit(`Status 33% : Token grabbing ${prey} discord Account...` );

       },ms(t7));

       let t8 = '16s';

       setTimeout(function(){

           msg.edit(`Status 40% : ${prey} discord Credentials Grabbed \n User ID : \`${n} \` \n Password : \`${s}\`` );

       },ms(t8));

       let t9 = '19s';

       setTimeout(function(){

           msg.edit(`Status 52% : Connecting Remote Db To ${prey} device....`);

       },ms(t9));

       let t10 = '20s';

       setTimeout(function(){

           msg.edit(`Status 59% : Sucessfully Connected...`);

       },ms(t10));

       let t11 = '21s';

       setTimeout(function(){

           msg.edit(`Status 78% : Extracting ${prey} datas Into remote database...`);

       },ms(t11));

       let t12 = '25s';

       setTimeout(function(){

           msg.edit(`Status 95% : Extraction Complete. Decryption and Zipping in process...`);

       },ms(t12));

       let t13 = '28s';

       setTimeout(function(){

           

         msg.edit(`Status 100% : Found ${i} Porn files in Folder named \`Homework Files\` `);

         },ms(t13));

         let t14 = '30s';

         setTimeout(function (){

           

       msg.channel.send(`Succesfuly hacked ${prey}.\n**I just sent you a text file to your DM with his IP and the password with the remote acess tokens **`);

         },ms(t14) );
            
              setTimeout(function(){
   
           message.author.send({
   files: [{
      attachment: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8Xe8rMzluNI5o6_udgIQCpa66bGIfIHL_Bw&usqp=CAU.jpg",
      name: "SPOILER_FILE.jpg"
   }]
});

     
}, 29000);

       });

}

 };
