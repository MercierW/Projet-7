<template>
    <div class="message-container mb-5 p-3">
        <div class="d-flex justify-content-between">
            <span class="name-user">{{ username }} :</span>
            <Dotes v-if="this.userIdNow === userId || this.isAdmin === 1" 
            @modify="modify" 
            @delete="deleted"
            @admin-delete="adminDelete" 
            :userId="userId" 
            />
        </div>

        <div class="main-message bb-custom">
            <p><pre v-html="content" v-linkified></pre></p>
            <div v-if="url !== null">
              <img class="rounded" :src="url" width="200">
            </div>
            <span class="date d-flex justify-content-end">{{parsingDate(date)}}</span>
        </div>

        <div v-if="responses.length < 5">
          <div class="mt-2 clearfix" v-for="response in domResponses" :key="response.id">
            <div class="div-response">
                <span class="name-responser name-user d-flex justify-content-between">{{response.userName}} : <span :id="response.id" @click="deleteResponse" v-if="isAdmin === 1"><i class="arrow-drop-color  fas fa-times pointer"></i></span></span>
                <p class="p-response" v-html="response.content" v-linkified></p>
                <div v-if="response.imgURL">
                  <img class="rounded" :src="response.imgURL" width="150">
                </div>
                <div class="d-flex justify-content-end mt-1">
                  <span class="date-response">{{parsingDate(response.createdAt)}}</span>
                </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="ml-2 d-flex align-items-center container">
            <div ref="arrowDrop">
              <i class="arrow-drop-color fas fa-sort-up rotate-arrow-drop"></i>
            </div>  
            <button @click="dropdownResponses" class="btn btn-txt-dropdown">
              <span v-if="show === false">Afficher les {{responses.length}} réponses</span>
              <span v-else>Masquer les {{responses.length}} réponses</span>
            </button>
          </div>
          <div ref="dropdownResponsesDiv" class="d-none">
            <div class="mt-2 clearfix" v-for="response in domResponses" :key="response.id">
              <div class="div-response">
                  <span class="name-responser name-user d-flex justify-content-between">{{response.userName}} : <span :id="response.id" @click="deleteResponse" v-if="isAdmin === 1"><i class="arrow-drop-color  fas fa-times pointer"></i></span></span>
                  <p class="p-response" v-html="response.content" v-linkified></p>
                  <div v-if="response.imgURL">
                    <img class="rounded" :src="response.imgURL" width="150">
                  </div>
                  <div class="d-flex justify-content-end mt-1">
                    <span class="date-response">{{parsingDate(response.createdAt)}}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <Form @post-response-done="postResponseDone" :messageId="this.messageId"/>

        <InputFile @post-file-done="postFileDone" :messageId="messageId"/>

        <div class="d-flex justify-content-end">
            <a @click="postLike" ref="like">
                <i class="likes-effect fas fa-thumbs-up fa-lg"></i>
            </a>
            <div class="d-flex align-items-center">
                <span class="mr-1">
                {{DomLike}}
                </span>
                <span class="ml-1">
                {{DomDislike}}
                </span>
            </div>
            <a @click="postDislike" class="mt-2" ref="dislike">
                <i class=" rotate likes-effect fas fa-thumbs-up fa-lg"></i>
            </a>
        </div>
    </div>
</template>

<script>
import Form from '@/components/Form.vue'
import InputFile from '@/components/InputFile.vue'
import Dotes from '@/components/Dotes.vue'
import axios from 'axios'

export default {
    components: {
        Form,
        InputFile,
        Dotes
    },
    name: "Messages",
    props: ["content", "date", "url", "responses", "like", "dislike", "username", "messageId", "userId"],
    data() {
        return {
          DomLike: this.like,
          DomDislike: this.dislike,
          usersNameLiked: [],
          usersNameDisliked: [],
          show: false,
          userIdNow: parseInt(sessionStorage.getItem('userId')),
          isAdmin: parseInt(sessionStorage.getItem('isAdmin')),
          userName: sessionStorage.getItem('userName'),
          domResponses: this.responses
        }
    },
    methods: {
      deleteResponse(e) {
        let responseId = e.currentTarget.id
        axios.delete('http://localhost:5000/message/admin/delete-response/' + responseId)
        .then(() => {
            console.log('Réponse supprimé')
            this.domResponses.forEach(response => {
              if(response.id === parseInt(responseId))
                this.responses.splice(this.responses.indexOf(response), 1)
            });
        })
        .catch(err => {
            console.log(err.response.data)
        })
      },
      adminDelete() {
        axios.delete('http://localhost:5000/message/admin/delete-message/' + this.messageId)
        .then(() => {
            console.log('Message supprimé')
            this.$emit('delete-message', {messageId: this.messageId})
        })
        .catch(err => {
            console.log(err.response.data)
        })
      },
      parsingDate(date) {
          return `${date.slice(8, 10)}-${date.slice(5, 8)}${date.slice(0, 4)} à ${date.slice(11, 16)}`
      },
      modify() {
          sessionStorage.setItem('messageContent', this.content)
          sessionStorage.setItem('messageId', this.messageId)
          this.$router.push('/modify-message')
      },
      deleted() {
          axios.delete('http://localhost:5000/message/delete/' + this.messageId)
          .then(() => {
              console.log('Message supprimé')
              this.$emit('delete-message', {messageId: this.messageId})
          })
          .catch(err => {
              console.log(err.response.data)
          })
      },
      postLike() {
        let like = this.$refs.like
        let dislike = this.$refs.dislike
        this.gestionLikeAndDislike(like, dislike)

        if(this.usersNameLiked.includes(this.userName)) {
          this.DomLike = this.DomLike - 1
          this.usersNameLiked = this.usersNameLiked.filter(name => name !== this.userName)
        } else {
          this.DomLike = this.DomLike + 1
          this.usersNameLiked.push(this.userName)
        }

        let data = {
          messageId: this.messageId
        }
  
        axios.post('http://localhost:5000/message/like', data)
        .then(() => {
          console.log('Post liké')
        })
        .catch(err => {
          console.log(err.response.data)
        })
      },
      postDislike() {
        let like = this.$refs.like
        let dislike = this.$refs.dislike
        this.gestionLikeAndDislike(dislike, like)

        if(this.usersNameDisliked.includes(this.userName)) {
          this.DomDislike = this.DomDislike - 1
          this.usersNameDisliked = this.usersNameDisliked.filter(name => name !== this.userName)
        } else {
          this.DomDislike = this.DomDislike + 1
          this.usersNameDisliked.push(this.userName)
        }

        let data = {
          messageId: this.messageId
        }
  
        axios.post('http://localhost:5000/message/dislike', data)
        .then(() => {
          console.log('Post disliké')
        })
        .catch(err => {
          console.log(err.response.data)
        })
      },
      postResponseDone() {
        axios.get('http://localhost:5000/message/get-responses', {
          params: {
            messageId: this.messageId
          }
        })
        .then(res => {
          this.domResponses = res.data
        })
        .catch(err => {
          console.log(err.response.data)
        }) 
      },
      postFileDone() {
        this.postResponseDone()
      },
      dropdownResponses() {
        this.$refs.dropdownResponsesDiv.classList.toggle('d-none')
        this.$refs.arrowDrop.classList.toggle('rotate-arrow-drop')
        if(this.show === false) {
          this.show = true
        } else {
          this.show = false
        }
      },
      gestionLikeAndDislike(el1, el2) {
        if(el1.classList.contains('like')) {
          el1.classList.remove('like')
          el2.classList.remove('unclick')
        } else if(el1.classList.contains('dislike')) {
          el1.classList.remove('dislike')
          el2.classList.remove('unclick')
        } else if(el1 === this.$refs.like) {
          el1.classList.add('like')
          el2.classList.add('unclick')
        } else {
          el1.classList.add('dislike')
          el2.classList.add('unclick')
        }
      },
      thisUserIsLike(userIsLike) {
        if(userIsLike) {
          this.$refs.like.classList.add('like')
          this.$refs.dislike.classList.add('unclick')
        }
      },
      thisUserIsDislike(userIsDislike) {
        if(userIsDislike) {
          this.$refs.dislike.classList.add('dislike')
          this.$refs.like.classList.add('unclick')
        }
      },
      likeUpdate() {
        axios
        .get("http://localhost:5000/message/usersLiked/" + this.messageId)
          .then((res) => {
            this.usersNameLiked = res.data.usersNameLiked
            this.thisUserIsLike(res.data.userIsLike)
          })
          .catch((err) => {
            console.log(err.response);
          });
      },
      dislikeUpdate() {
        axios
        .get("http://localhost:5000/message/usersDisliked/" + this.messageId)
          .then((res) => {
            this.usersNameDisliked = res.data.usersNameDisliked
            this.thisUserIsDislike(res.data.userIsDislike)
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    },
    mounted() {
      this.likeUpdate()
      this.dislikeUpdate()
    }
}
</script>

<style scoped>
pre {
  font-size: 16px;
  font-weight: 200;
  margin-top: 1%;
  margin: 0;
  overflow: hidden;
  white-space : pre-wrap;
  opacity: 0.9;
}

p {
  margin: 0;
  padding: 5px;
}

a {
  margin: 1%;
  color: black;
}

a:hover {
  text-decoration: none;
  color: black;
}

button:focus {
  box-shadow: none;
}

.btn-txt-dropdown {
  color: rgb(0, 105, 217);
  font-size: 14px;
}

.p-response {
  opacity: 0.9;
  font-size: 14px;
}

.message-container {
  margin-bottom: 50%;
  margin-top: 5%;
  background: rgba(214, 205, 205, 0.8);
  border-radius: 10px;
  padding: 10px;
}

.main-message {
  margin-bottom: 3%;
  padding-bottom: 3%;
  font-size: 18px;
}

.likes-effect:hover {
  cursor: pointer;
  opacity: 0.5;
}

.rotate {
  transform: rotate(180deg);
}

.date {
  margin-top: 2%;
  font-size: 11px;
  opacity: 0.7;
}

.date-response {
  border-top: solid 1px rgba(0, 0, 0, 0.2);
  font-size: 11px;
  opacity: 0.7;
  justify-self: end;
}

.bb-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.div-response {
  background-color: rgba(214, 205, 205, 0.9);
  border-radius: 20px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-bottom: 2%;
  float: left;
}

.name-user {
  opacity: 0.7;
  font-weight: 600;
}

.name-responser {
  font-size: 14px;
}

.fa-thumbs-up {
  opacity: 0.7;
}

.arrow-drop-color {
  color:rgb(0, 105, 217);
}

.rotate-arrow-drop {
  transform: rotate(180deg);
}

.like {
  color: rgb(0, 105, 217) !important;
}

.dislike {
  color: rgb(200, 35, 51) !important;
}

.unclick {
  opacity: 0.3 !important;
  pointer-events: none;
}

.pointer {
  cursor: pointer;
}
</style>