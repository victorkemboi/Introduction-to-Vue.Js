var eventBus = new Vue()

Vue.component(
    'product-customization',{
         props:{
            activeVariant:{
                type: Object,
                required: true
            },
            
        },
        template: `
                    <div class="customize-product" >

                        <div style="display: inline-block;">
                                    <p>Select color:
                                    <div 
                                    class="color-box" 
                                    style = "backgroundColor: green; " 
                                    @mouseover="updateColor('green')"
                                    >
                                    </div>
                                    <div 
                                        class="color-box" 
                                        style = "backgroundColor: blue;"
                                        @mouseover="updateColor('blue')"
                                        >
                                    </div>
                        </div>

                        <div style="display: inline-block; margin-left: 15px;">

                                <form>
                                    
                                    <label for="size">Select size: </label>
                                    <select id="size" v-on:onchange="optionsChanged"  v-model="size">
                                        
                                        <option value= "x-large">X-Large</option>
                                        <option value= "large">Large</option>
                                        <option value= "medium" selected>Medium</option>
                                        <option value= "small"  >Small</option>
                                    </select>
                                    
                                </form>
                        </div>

                    </div>
        `,
        data(){
            return {
                size:this.activeVariant.size    ,
                color: this.activeVariant.variantColor        
            }
        },
        methods:{
            optionsChanged:  function(){
               
             let   variant = {
                 size : this.size,
                 color : this.color
             }
                
                this.$emit('options-changed', variant)
            },
            updateColor: function(color){
                

                this.color = color
            }
        },
        watch:{
            size: function(val,oldVal){
                this.optionsChanged()
            },
            color: function(val,oldVal){
                this.optionsChanged()
            }

        }

    }
)

Vue.component(
    'product-review',
    {
        template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b> Please corrrect the following error(s):</b>
                <ul>
                    <li v-for ="error in errors">
                        {{error}} </li>
                        </ul>
                        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review" ></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>
        Would you recommend this product to someone else? </p>

        <input type="radio" id="yes" name="recommend"
         value="yes" v-model = "recommendation">
        <label for="yes">Yes</label><br>
        <input type="radio" id="no" name="recommend"
         value="no" v-model = "recommendation">
        <label for="no">No</label><br>
            
        <p>
          <input type="submit" value="Submit">  
        </p>    
      
      </form>
        `,
        data(){
            return {
                name: null,
                review: null,
                rating: null,
                errors:[],
                recommendation: null
            }
        },
        methods:{
            onSubmit: function(){
                this.errors = []
                if(this.name && this.review && this.rating && this.recommendation){
                    let productReview = {
                        name : this.name,
                        review: this.review,
                        rating: this.rating
                    }
    
    
                    eventBus.$emit('review-submitted', productReview)
                    this.name = null
                    this.review = null
                    this.rating = null
                    this.recommendation = null
                }else{
                    if(!this.name) this.errors.push("Name required!")
                    if(!this.review) this.errors.push("Review required!")
                    if(!this.rating) this.errors.push("Rating required!")
                    if(!this.recommendation) this.errors.push("Recommendation required!")
                }
                
            }
        }
    }
)

Vue.component(
    'product-details',
   { props:{
       activeVariant:{
           type: Object,
           required: true
       },
       
   },
       
    template: `

    <ul>
        <li 
        v-for="detail in details">
        {{detail}} </li>
        <li> Size: {{
            activeVariant.size
        }}</li>
    </ul>
    
   `,
   data(){
       return{
        details:["80% cotton","20% Polyester", "Gender-neutral"],
       }
   }
}
)


Vue.component('product',{
    props:{
        premium:{
            type:Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
                <div class="product-image">
                    <img v-bind:src="image"/>
                </div>

                <div class="product-info">
                

                    <h1>{{product}}</h1>
                   
                
                    <p v-if="inStock" style="display: inline-block;">
                      In Stock.
                        
                    </p>
                    <p  v-else :class="{outOfStock : !inStock}"
                     >
                     
                            Out of Stock! </p>

                            <div class="color-circle" style="display: inline-block;  text-align: center;"   >
                                <p>{{activeVariant.amount}}</p>
                            </div>

                            <p>Shipping: {{shipping}}<p/>

                            <product-details :activeVariant="activeVariant">

                            </product-details> 
                    
                 <!--   <div v-for="variant in variants" 
                        :key="variant.variantId"
                        class="color-box"
                        :style = "{backgroundColor: variant.variantColor}"
                        @mouseover="updateProduct(variant)"
                    >
                    
                    <p style="color: white;">{{variant.amount}}</p>
                    </div>
                    -->

                    <!-- product custom -->

                    <product-customization
                        :activeVariant="activeVariant"
                        @options-changed = "findCustomProduct"
                    ></product-customization>
                    

                    <div >
                        <button
                            v-on:click="addToCart"
                            :disabled ="!inStock" 
                            :class="{disabledButton:!inStock}"
                            style="float: center;  background-color: coral;  box-shadow: 2px 3px 5px gray;"
                            >
                                Add to
                                Cart
                        </button>

                   

                        <button 
                             v-on:click="removeFromCart">Remove 
                        </button>

                    </div>

                   

                    <product-tabs :reviews="reviews"></product-tabs>

                       
                
                   
                </div>

               

        </div>

    `
    ,data()
    {
        return {
            product: 'Socks',
            description: 'Off-white funky socks.',
            image:"./assets/img/green_sock.png",
            link: "https://www.vuejs.org",
            inStock: true,
            
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
           
            activeVariant:null,
            reviews: []
        }

    } ,

    methods:{
        
    
       findCustomProduct(variantOptions){

        
       
          let sameColor=  this.variants.filter((variant) => {return variant.variantColor == variantOptions.color})
          
          let sameSize=  sameColor.find((variant) => {return variant.size == variantOptions.size})
   
          
          this.updateProduct(sameSize)
       },
        addToCart: function(){

            //check if variant in cart and cart items is not zero
        this.$emit('add-to-cart', this.activeVariant)
          


        },
        updateProduct: function (variant){
           
            this.image = variant.variantImage;
            this.activeVariant = variant

        
        },
        removeFromCart: function(){
                this.$emit("remove-from-cart", this.activeVariant)
           
        },
        initActiveVariant: function(){
            this.activeVariant = this.variants[0]
        }
      
    },
    beforeMount(){
        this.initActiveVariant()
        //this.findCustomProduct()
     },
     computed:{
         shipping(){
             if(this.premium){
                 return "Free"
             }else{
                 2.99
             }
         }
     },
     watch: {
         
         'activeVariant.amount': function(val,oldVal){

    
            if(val>0){
              this.inStock = true
            }else{
               this.inStock = false
            }
            
         }
     },
     mounted() {
         eventBus.$on('review-submitted',productReview =>{
            this.reviews.push(productReview)
         })
     },

}
)

Vue.component(
    'product-tabs',{
        template:  `
        <div>
            <span
                 class="tab"
                 :class="{activeTab:selectedTab === tab}"
                 v-for="(tab, index) in tabs" :key="index"
                 @click="selectedTab = tab"
                 >
                <h3 style="display: inline-block;"> {{tab}} </h3></span>
            

            </span>

            <div v-show="selectedTab=='Reviews'">
            <p v-if="!reviews.length">There are no reviews yet!</p>
            <ul>
                    <li v-for="review in reviews">
                       <p>Name:  {{review.name}}</p>
                       <p>Rating:  {{review.rating}}</p>
                       <p>Review:  {{review.review}}</p>
                    </li>
                    </ul>

        </div>

        <product-review  v-show="selectedTab=='Make a Review'"   @review-submitted = "addReview"></product-review>

        
        </div>`
    ,
    data(){
        return  {
            tabs: [ 'Make a Review','Reviews'],
            selectedTab: 'Make a Review'
        }
    },
    props:{
        reviews:{
            type: Array,
            required: true
        }
    }
    },
    
)


var app =  new Vue({
    el: '#app',
    data:{
        premium: true,
        cart: {
            items:[]
         },
         cartNo:0,
    },
    methods:{
        updateCart: function(variant){
            
           if(variant.amount>0){

          

            if(this.cart.items.length>0 && this.cart.items.includes(variant)){

                
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

        }else{
            this.inStock = false;
        }

        
    

            this.getCartNo()
        },
        getCartNo: function(){
            let cartNoo = 0  
            this.cart.items.map(
                
                item =>{
                    cartNoo += item.cart

                }
            )

           this.cartNo = cartNoo
        },
        removeInCart: function(variant){
           
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

                            /*   this.variants.find(item=>{
                                    if(item.variantId == variant.variantId){
                                       item = variant
                                    }
                                }) */
                            }
                            
                    
                        }
                    }
                )

               

              
                if(variant.amount >0){
                    this.inStock = true
                }else{
                    this.inStock = false
                }
                
            }
            

            this.getCartNo()
        }
    }
    
})