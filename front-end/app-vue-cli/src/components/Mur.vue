<template>
    <div id="mur">
        <h1 class="mt-4 mb-5 container d-flex justify-content-center align-items-center">Bienvenue sur le mur d'échange de Groupomania</h1>
        <div id="content">
            <div class="container col-md-8 col-xl-5">
                <Messages v-for="message in messages" :key="message.content"
                :username="message.userName" 
                :content="message.content" 
                :url="message.imgURL" 
                :date="message.createdAt"
                :responses="message.responses"
                :like="message.like"
                :dislike="message.dislike"
                :messageId="message.id"
                :userId="message.userId"
                @delete-message="deleteMessage"
                />
            </div>
        </div>
        <transition name="fade">
            <div class="loading" v-show="loading">
                <span class="fa fa-spinner fa-spin"></span> Loading
            </div>
        </transition>
        <footer id="footer">
            <div class="d-flex justify-content-center align-items-center">
            <i class="far fa-copyright fa-lg"></i>
            <p>Tous droits réservés</p>
            </div>
        </footer>
    </div>
</template>

<script>
import axios from 'axios';
import Messages from '@/components/Messages.vue'

export default {
    components: {
        Messages,
    },
    data() {
        return {
            messages: [],
            index: 2,
            endIndex: false,
            loading: false
        }
    },

    methods: {
        pagination() {
            window.addEventListener('scroll', () => {
                let scrollHeight = document.documentElement.scrollHeight
                let clientHeight = document.documentElement.clientHeight
                let scrollTop = document.documentElement.scrollTop
                let Lscreen= screen.width;

                if (Lscreen > 420) {
                    if (scrollTop + clientHeight >= scrollHeight && this.endIndex === false) {
                    this.loadMore()
                    this.index += 2
                    } else {
                        return console.log("Il n'y a plus de message")
                    }
                } else {
                    if (scrollTop + clientHeight + 427 >= scrollHeight && this.endIndex === false) {
                    this.loadMore()
                    this.index += 2
                    } else {
                        return console.log("Il n'y a plus de message")
                    }
                }
            })
        },
        loadMore() {
            axios
            .get("http://localhost:5000/message/all", {
                params: {
                    numberOfMessage: parseInt(this.index)
                }
            })
            .then((res) => {
                let arrayOfMessages = res.data.messages

                if(res.data.fin) {
                    return this.endIndex = true
                }
                this.loading = true;

                setTimeout(() => {
                    arrayOfMessages.forEach(message => {
                        this.messages.push(message)  
                    }); 
                    this.loading = false;
                }, 300);
            })
            .catch((err) => {
                console.log(err.response);
            });
        },
        deleteMessage(payload) {
            this.messages = this.messages.filter(message => message.id !== payload.messageId)
        },
        getMessages() {
            axios
            .get("http://localhost:5000/message/all")
            .then((res) => {
                this.messages = res.data.messages
            })
            .catch((err) => {
                if(err.response.status === 401) {
                    this.$router.push('/login')
                }
                console.log(err.response);
            });
        },
    },

    mounted() {
        let token = sessionStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.getMessages()
        this.pagination()
        console.log('DOM mounted')
    }
}
</script>

<style scoped>
#mur {
  height: 100%;
}

#content {
  min-height: calc(100vh - 84px);
}

#footer {
  background-color: rgb(52, 58, 64);
  position: relative;
  bottom: 0px;
  width: 100%;
  color: white;
  padding: 5px;
}

#footer p {
    margin: 0;
}

h1 {
    background: rgba(214, 205, 205, 1);
    opacity: 0.8;
    padding: 10px;
    border-radius: 10px;
    font-size: 20px;
    width: 500px;
}

.loading {
  text-align: center;
  position: fixed;
  color: #fff;
  z-index: 9;
  background: #6191c9;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 45px);
  top: calc(90% - 18px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

@media screen and (max-width: 570px) {
    #mur {
        width: 560px;
    }

    #content {
        min-height: calc(160vh - 84px);
    }
}

</style>