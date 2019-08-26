new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        gameIsRunning: false, // btn onaj za start new game, po difoltu ga stavljamo da bude false
        turns: []
    },

    methods: {
        startGame: function() {
            this.gameIsRunning = true;
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.turns = []; // resetujemo array tj logs, tj ako smo vec prethodno igarali, da pocnemo za praznim nizom
        },

        attack: function() {
            // kada player napada, dakle monster damage
            // var max = 10;
            // var min = 3;
            // var damage = Math.max(Math.floor(Math.random() * max) + 1, min); // bez ovog plus jedan (dakle Math.random() * max)) je broj izmedju 0 i 9, kada dodamo 1, onda je izmedju 1 i 10 (Math.floor(Math.random() * max) + 1), ali mi hocemo minimun stetu od 3, dakle u Math.max() stavljamo ovo od 1 do 10 kao prvi parametar, a za drugi parametar stavljamo min tj 3. Dakle ako je random broj 1 ili dva, uzece za min da bude ovaj 3 koji smo stavili, u suprotnom, ako je generisao veci broj od 2, uzima taj random broj koji je generisao
            var damage = this.calculateDamage(3, 10);
            this.monsterHealth -= damage;

            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster for ' + damage
            }); // ne zelimo da pushujemo vec unshiftujemo a on je push ali na pocetak niza, a ne na kraju

            // if(this.monsterHealth <= 0) {
            //     alert('You won!');
            //     this.gameIsRunning = false;
            //     return; // stavljamo return jer ima koda i nakon ovog ifa, a mi zelimo da ako se ovo u ovom ifu desi, ako je true da se ova attack f-ja stopira sa daljim radom/kodom
            // } // i ove ifove stavljamo kao posena f=ja checkWin

            if (this.checkWin()) {
                return; // ovo return je da se dalji kod ne bi vrsio
            }


            // kada monster napada, dakle player damage
            // max = 12;
            // min = 5;
            // damage = Math.max(Math.floor(Math.random() * max) + 1, min);
            // damage = this.calculateDamage(5, 12);
            this.playerHealth -= this.calculateDamage(5, 12);

            // kao sto vidimo, ponavljamo se, pa hajde onda da napravimo 1 f-ju za to (calculateDamage())
            // al avaj, kada probamo ovaj kod, kada nastavjamo sa attackom idemo u NEGATIVAN BROJ. Pritom, zelim da cekiram da li smo mrtvi
            // if(this.playerHealth <= 0) {
            //     alert('You lost!');
            //     this.gameIsRunning = false;
            //     // ovde ne treba return jer dalje nakon ovog ifa nema koda
            // }

            this.checkWin(); // ovde ne trba if niti return jer nemamo kod dalje
        },

        specialAttack: function() {
            var damage = this.calculateDamage(10, 20);
            this.monsterHealth -= damage;
            this.turns.unshift({
                isPlayer: true,
                text: 'Player hits Monster HARD for ' + damage
            }); 
            if (this.checkWin()) {
                return;
            };

            // this.playerHealth -= this.calculateDamage(5, 12);
            // this.checkWin();
            this.monsterAttacks();

            // i da, i ovde imamo code duplication, msm u attack i specialAttack, pogotovo za kada monster napada, pa hajde da ga izvdojimo u posebn f-ju
        },

        heal: function() {
            if (this.playerHealth <= 90) {
                this.playerHealth += 10; // medjutim, mozemo da se overhealingujemo hehe, tj da playerHealth ide preko 100, a samim tim i sirina zelenog diva preko 100%, pa hajde da ga ogranicnimo sa ifom tj da ovo this.playerHealth += 10; stavimo u if  
            } else {
                this.playerHealth = 100; // dakle ako je vece od 90 stavljamo da health bude 100 (wtf)
            }

            this.turns.unshift({
                isPlayer: true,
                text: 'Player heals for 10'
            }); 
            this.monsterAttacks();
        },

        giveUp: function() {
            this.gameIsRunning = false;
        },

        monsterAttacks: function() {
            var damage = this.calculateDamage(5, 12);
            this.playerHealth -= damage;
            this.checkWin();

            this.turns.unshift({
                isPlayer: false, // nije player
                text: 'Monster hits Player for ' + damage
            });
        },

        calculateDamage: function(min, max) {
             return Math.max(Math.floor(Math.random() * max) + 1, min);
        },

        checkWin: function() {
            if(this.monsterHealth <= 0) {
                if(confirm('You won! New Game?')) { // ok, player je pobedio i sa confirm  ga pitamo da li zeli ponovo da igra, ako zeli (onda je ovaj if true) i pozivamo f-ju startGame()
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true; // pisemo return jer imamo posle kod tj else if

            } else if (this.playerHealth <= 0) {
                if(confirm('You lost! New Game?')) {
                    this.startGame();
                } else {
                    this.gameIsRunning = false;
                }
                return true
            }
            return false; // zasto boolean? Jer gore u f-ji attach, pozivamo ovu f-ju checkWin u ifu, a taj if mora da bude true ili false, odnosno ova f-jau tom ifu treba da vraca true ili false. Ako se vrati true znam da ne zelim da nastavljam sa daljim kodom jer je ig ra gotova
        }
    }
});