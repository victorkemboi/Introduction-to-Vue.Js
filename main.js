var app =  new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        description: 'Off-white funky socks.',
        image:"./assets/img/green_sock.png",
        link: "https://www.vuejs.org",
        inStock: true,
        details:["80% cotton","20% Polyester", "Gender-neutral"],
        variants:[
            {
                variantId: 2234,
                variantColor: "green",
                variantImage: "./assets/img/green_sock.png",
                cart:0,
                amount: 8,
                size: "small"
            },
            {
                variantId: 2235,
                variantColor: "green",
                variantImage: "./assets/img/green_sock.png",
                cart:0,
                amount: 12,
                size: "medium"
            },
            {
                variantId: 2236,
                variantColor: "green",
                variantImage: "./assets/img/green_sock.png",
                amount: 14,
                cart:0,
                size: "large"
            },
            {
                variantId: 2237,
                variantColor: "green",
                variantImage: "./assets/img/green_sock.png",
                amount: 15,
                cart:0,
                size: "x-large"
            },
            {
                variantId: 2238,
                variantColor: "blue",
                variantImage: "./assets/img/blue_sock.png",
                amount: 8,
                cart:0,
                size: "small"
            },
            {
                variantId: 2239,
                variantColor: "blue",
                variantImage: "./assets/img/blue_sock.png",
                amount: 12,
                cart:0,
                size: "medium"
            },
            {
                variantId: 2240,
                variantColor: "blue",
                variantImage: "./assets/img/blue_sock.png",
                amount: 14,
                cart:0,
                size: "large"
            },
            {
                variantId: 2241,
                variantColor: "blue",
                variantImage: "./assets/img/blue_sock.png",
                amount: 15,
                cart:0,
                size: "x-large"
            },
        ],
        cart: {
           items:[]
        },
        cartNo:0,
        activeVariant:null
    },
    methods:{
        addToCart: function(){

            //check if variant in cart and cart items is not zero

            let variant = this.activeVariant

            if(this.cart.items.length>0 && this.cart.items.includes(this.activeVariant)){
                variant.cart += 1;
                variant.amount -= 1;

               this.cart.items.find(item=>{
                   if(item.variantId == variant.variantId){
                    item = variant
                   }
               })

            }else{
                variant.amount -= 1;
                variant.cart += 1;
                this.cart.items.push(
                    variant
                )
            }

            

        
            if(variant.amount == 0){
                this.inStock = false;
            }

            this.getCartNo()
          


        },
        updateProduct: function (variant){
            this.image = variant.variantImage;
            this.activeVariant = variant

            if(this.activeVariant.amount>0){
                this.inStock = true
            }else{
                this.inStock = false
            }
        },
        removeFromCart: function(){

            let variant = this.activeVariant
            //check if items in cart
            if(this.cart.items.length >0){
               //find active variant
                this.cart.items.find(
                    item =>{
                        
                        if(variant.variantId == item.variantId){

                            if(variant.cart>0){
                                variant.cart -= 1;
                                variant.amount += 1;

                                item = variant

                                this.variants.find(item=>{
                                    if(item.variantId == variant.variantId){
                                       item = variant
                                    }
                                })
                            }
                            
                    
                        }
                    }
                )

               

              
                if(this.activeVariant.amount >0){
                    this.inStock = true
                }else{
                    this.inStock = false
                }
                
            }
            

            this.getCartNo()
           
        },
        initActiveVariant: function(){
            this.activeVariant = this.variants[0]
        },
        getCartNo: function(){
            let cartNoo = 0  
            this.cart.items.map(
                
                item =>{
                    cartNoo += item.cart

                }
            )

           this.cartNo = cartNoo
        }
    },
    beforeMount(){
        this.initActiveVariant()
     }
})