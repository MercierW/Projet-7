<template>
  <div id="mur">
    <div id="content">
      <!-- Bouton poster message et déconnexion -->
      <div class="container-fluid">
        <div class="row mt-3">
          <div class="col text-right">
            <button @click="switchMessageComp" class="btn btn-primary">Poster un message</button>
            <router-link class="btn btn-primary" to="/">
              Déconnexion
            </router-link>
          </div>
        </div>
      </div>
      <!-- Bouton poster message et déconnexion -->
      <!-- Container message -->
      <div class="container col-10 col-md-8 col-lg-6 col-xl-4">
        <div
          v-for="message in obj"
          :key="message.content"
          class="row message-container"
          :id="'message-container-' + message.id"
        >
          <div ref="messageContainer" class="container text-left">
            <!-- Dropdown -->
            <div class="d-flex justify-content-between">
              <span class="name-user">{{ message.userName }} :</span>
              <div v-if="message.userId === userId" ref="dropdownDiv" class="dropdown">
              <button @click="visible" class="btn-fa-ellipsis-h btn p-0"><i class="fas fa-ellipsis-h fa-lg"></i></button>
              <div ref="dropdownMenu" id="dropdown" class="dropdown-content">
                <p @click="modify" :id="'modify-' + message.id" class="font-weight-bold txt-opacity">Modifier</p>
                <p @click="deleted" :id="'delete-' + message.id" class="font-weight-bold txt-opacity">Supprimer</p>
              </div>   
              </div>
            </div>
            <!-- Dropdown -->
            <!-- Message -->
            <div class="main-message bb-custom">
            <p>
              <pre>{{ message.content }}</pre>
            </p>
            <div v-if="message.imgURL">
                <img :src="message.imgURL" width="200" />
            </div>
            <div class="date d-flex justify-content-end"
                >Le {{ message.createdAt.slice(8, 10) }}-{{
                  message.createdAt.slice(5, 8)
                }}{{ message.createdAt.slice(0, 4) }} à
                {{ message.createdAt.slice(11, 16) }}</div
              >
            </div>
            <!-- Message -->
            <!-- Réponses -->
            <div ref="special">
              <div ref="responseContainer" v-for="response in message.responses" :key="response.imgURL" class="responses-container">
                <div class="clearfix">
                  <div class="div-response">
                    <div class="name-responser name-user">
                      {{ response.userName }} :
                    </div>
                    <p class="p-response">{{ response.content }}</p>
                    <div v-if="response.imgURL">
                      <img :src="response.imgURL" width="200" />
                    </div>
                      <span class="date-response"
                        >{{ response.createdAt.slice(8, 10) }}-{{
                          response.createdAt.slice(5, 8)
                        }}{{ response.createdAt.slice(0, 4) }} à
                        {{ response.createdAt.slice(11, 16) }}</span
                      >
                  </div>
                </div>
              </div>
            </div>
            <!-- Réponses -->
            <!-- Champs, input, like et dislike -->
            <form @submit.prevent="" class="pt-3 mt-2 form" :id="message.userName + '-' + message.id" enctype="multipart/form-data">
              <div class="div-textarea">
                <textarea
                  @input="updateTextareaHeight"
                  @keydown.enter="textResponse"
                  type="text"
                  name="message"
                  placeholder="Écrivez un commentaire..."
                  autocomplete="off"
                  rows="1"
                  cols="150"
                  maxlength="500"
                  minlength="1"
                  wrap="soft"
                  :id="message.userName + '-' + message.id + '-' + 'textarea'"
                >
                </textarea>
              </div>

              <div class="d-flex mt-4">
                <button @click="triggeredInputFile" type="button" class="btn btn-success">
                  <label>Envoyer un fichier</label>
                  <input
                    type="file"
                    name="file"
                    ref="file"
                    @change="selectFile"
                    :id="'input-file' + '-' +  message.id"
                    class="d-none"
                  />
                </button>
                <div class="mt-1 ml-2 d-none">
                  <button @click="sendFile" type="button" class="btn btn-primary mr-1"><i class="fas fa-upload"></i></button>
                  <button @click="removeFile" type="button" class="btn btn-danger ml-1">X</button>
                </div>
              </div>

              <div id="col" class="row justify-content-end h-100">
                <a @click="postLike" :id="'like' + '-' + message.id">
                  <i class=" likes-effect fas fa-thumbs-up fa-lg"></i>
                </a>
                <div class="d-flex align-items-center">
                  <span class="mr-1">
                    {{message.like}}
                  </span>
                  <span class="ml-1">
                    {{message.dislike}}
                  </span>
                </div>
                <a @click="postDislike" :id="'dislike' + '-' + message.id" class="mt-2">
                  <i class=" rotate likes-effect fas fa-thumbs-up fa-lg"></i>
                </a>
              </div>

            </form>
            <!-- Champs, input, like et dislike -->
          </div>
        </div>
      </div>
      <!-- Container message -->
      <!-- Footer -->
      <footer id="footer">
        <div class="d-flex justify-content-center align-items-center">
          <i class="far fa-copyright fa-lg"></i>
          <p>Tous droits réservés</p>
        </div>
      </footer>
      <!-- Footer -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "Mur",
  data() {
    return { 
      show : {},
      messages: [],
      responses: [],
      usersLiked: [],
      usersDisliked: [],
      userId: parseInt(sessionStorage.getItem('userId')),
      obj: []
    };
  },

  methods: {

    deleted(e) {
      let target = parseInt(e.target.id.split('-')[1])
  
      axios.delete('http://localhost:5000/message/delete/' + target)
        .then(() => {
          console.log('Message supprimé')
          axios.get("http://localhost:5000/message/all")
            .then((res) => {
              this.messages = res.data.reverse();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },

    modify(e) {
      let targetId = parseInt(e.target.id.split('-')[1])
      console.log(targetId)
      this.messages.forEach(message => {
        if(targetId === message.id) {
          sessionStorage.setItem('messageContent', message.content)
          sessionStorage.setItem('messageId', targetId)
          this.$router.push('/message-modify')
        }
      })
    },

    visible(e) {
      e.currentTarget.nextSibling.classList.toggle('d-block')
    },

    documentClick(e){
      let arrayOfDPDiv = this.$refs.dropdownDiv
      let dropdownMenu = this.$refs.dropdownMenu
      let target = e.target
      for (let i = 0; i < this.messages.length; i++ ) {
        if (arrayOfDPDiv[i] && !arrayOfDPDiv[i].contains(target)) {
          dropdownMenu[i].classList.remove('d-block')
        }
      }
    },
  
    postLike(e) {
      let target = e.currentTarget
      let dislikeIcone = document.getElementById('dislike-' + target.id.split('-')[1])

      if(dislikeIcone.firstChild.classList.contains('likes-effect')) {
        target.style.color = 'rgb(0, 105, 217)'
        dislikeIcone.style.opacity = 0.3
        dislikeIcone.firstChild.classList.remove('likes-effect')
        dislikeIcone.style.pointerEvents = 'none'
      } else {
        target.style.color = 'rgb(33, 37, 41)'
        dislikeIcone.style.opacity = 1
        dislikeIcone.firstChild.classList.add('likes-effect')
        dislikeIcone.style.pointerEvents = 'auto'
      }
   
      let data = {
        messageId: parseInt(target.id.split('-')[1])
      }
      
      axios.post('http://localhost:5000/message/like', data)
        .then(() => {
          console.log('Post liké')
          axios.get("http://localhost:5000/message/all")
            .then((res) => {

              let arrayOfMessages = Array.from(res.data.messagesFound)
              arrayOfMessages.forEach(message => {
                this.obj.forEach(dataMessage => {
                  if (message.id === dataMessage.id) {
                    dataMessage.like = message.like
                  }
                })
              })
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },
    postDislike(e) {
      let target = e.currentTarget
      let likeIcone = document.getElementById('like-' + target.id.split('-')[1])

      if(likeIcone.firstChild.classList.contains('likes-effect')) {
        console.log('bleu')
        target.style.color = 'rgb(200, 35, 51)'
        likeIcone.style.opacity = 0.3
        likeIcone.firstChild.classList.remove('likes-effect')
        likeIcone.style.pointerEvents = 'none'
      } else {
        console.log('noir')
        target.style.color = 'rgb(33, 37, 41)'
        likeIcone.style.opacity = 1
        likeIcone.firstChild.classList.add('likes-effect')
        likeIcone.style.pointerEvents = 'auto'
      }

      let data = {
        messageId: parseInt(target.id.split('-')[1])
      }
      axios.post('http://localhost:5000/message/dislike', data)
        .then(() => {
          console.log('Post disliké')
          axios.get("http://localhost:5000/message/all")
            .then((res) => {

              let arrayOfMessages = Array.from(res.data.messagesFound)
              arrayOfMessages.forEach(message => {
                this.obj.forEach(dataMessage => {
                  if (message.id === dataMessage.id) {
                    dataMessage.dislike = message.dislike
                  }
                })
              })
            });
        })
        .catch(err => {
          console.log(err.response.data)
        })
    },

    switchMessageComp() {
      this.$router.push('/message')
    },

    selectFile(e) {
      let target = e.currentTarget
      let labelTarget = target.previousSibling
      labelTarget.textContent = target.files[0].name
      let divBtns = target.parentNode.nextSibling
      divBtns.classList.remove('d-none')
    },

    triggeredInputFile(e) {
      let target = e.currentTarget
      target.lastChild.click()
    },

    removeFile(e) {
      let target = e.currentTarget
      let fileInput = target.parentNode.previousSibling.lastChild
      let labelInputFile = target.parentNode.previousSibling.firstChild
      labelInputFile.textContent = 'Envoyer un fichier'
      fileInput.value = ''
      target.parentNode.classList.add('d-none')
    },

    sendFile(e) {
      let target = e.currentTarget
      let inputFile = target.parentNode.previousSibling.lastChild
      let labelInputFile = target.parentNode.previousSibling.firstChild
      let divBtns = target.parentNode

      let obj = {
        messageId: parseInt(inputFile.id.split('-')[2]),
        file: inputFile.files[0]
      }
      
      this.postResponse(obj)
      inputFile.value = ''
      labelInputFile.textContent = 'Envoyer un fichier'
      divBtns.classList.add('d-none')
    },

    textResponse(e) {
      let target = e.currentTarget
      let allTextarea = Array.from(document.getElementsByTagName('textarea'))

      if (e.keyCode == 13 && !e.shiftKey) {
        allTextarea.forEach(el => {
          if(target.id === el.id && target.value.length > 0) {
            let objResp = {
              messageId: parseInt(target.id.split('-')[1]),
              response: target.value
            }
            e.preventDefault();
            this.postResponse(objResp)
            target.value = ''
          }
          e.preventDefault();
        })
      }
    },

    updateTextareaHeight(e) {
      let target = e.currentTarget
      target.style.height = "auto";
      target.style.height = target.scrollHeight + "px";
    },

    postResponse(response) {
      let responseMessage = response.response
      let messageId = response.messageId
      let file =  response.file

      const data = new FormData();
      data.append('response', responseMessage)
      data.append('messageId', messageId)
      data.append('file', file)

      axios
        .post("http://localhost:5000/message/response", data)
        .then(() => {
          console.log("Réponse envoyé !");
          axios
            .get("http://localhost:5000/message/all")
            .then((res) => {
              let arrayOfResponse = Array.from(res.data.responsesFound)
              
              this.obj.forEach(message => {
                message.responses = []
              })

              arrayOfResponse.forEach(response => {
                this.obj.forEach(dataMessage => {
                  if (response.messageId === dataMessage.id) {
                    dataMessage.responses.push(response)
                  }
                })
              })
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    },
  },

  created () {
    document.addEventListener('click', this.documentClick)
    console.log('DOM created')
  },

  mounted() {
    let token = sessionStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    axios
      .get("http://localhost:5000/message/all")
      .then((res) => {
        this.messages = res.data.messagesFound.reverse();
        this.responses = res.data.responsesFound

        let arrayOfMessages = Array.from(res.data.messagesFound)
        let arrayOfResponse = Array.from(res.data.responsesFound)

        arrayOfMessages.forEach(message => {
          this.obj.push({
            ...message,
            responses: []
          })
        })

        this.obj.forEach(el => {
          arrayOfResponse.forEach(res => {
            if(el.id === res.messageId) {
              el.responses.push(res)
            }
          })
        })

        this.messages.forEach(message => {
        this.show[message.id] = false
        })
      })
      .catch((err) => {
        console.log(err.response);
      });

    axios
      .get("http://localhost:5000/message/usersLiked")
      .then((res) => {
        this.usersLiked = res.data;
        let usersLikedArray = Array.from(this.usersLiked)
        usersLikedArray.forEach(user => {
          if(user.usersLikedId === this.userId) {
            document.getElementById('like-' + user.messagesLikedId).style.color = 'rgb(0, 105, 217)'
            document.getElementById('dislike-' + user.messagesLikedId).style.opacity = 0.3
            document.getElementById('dislike-' + user.messagesLikedId).style.pointerEvents = 'none'
            document.getElementById('dislike-' + user.messagesLikedId).firstChild.classList.remove('likes-effect')
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:5000/message/usersDisliked")
      .then((res) => {
        this.usersDisliked = res.data;
         let usersDislikedArray = Array.from(this.usersDisliked)
        usersDislikedArray.forEach(user => {
          if(user.usersDislikedId === this.userId) {
            document.getElementById('dislike-' + user.messagesDislikedId).style.color = 'rgb(200, 35, 51)'
            document.getElementById('like-' + user.messagesDislikedId).style.opacity = 0.3
            document.getElementById('like-' + user.messagesDislikedId).style.pointerEvents = 'none'
            document.getElementById('like-' + user.messagesDislikedId).firstChild.classList.remove('likes-effect')
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });
    console.log('DOM mounted')
  },
  updated() {
    console.log('DOM updated')
  },

  destroyed () {
    document.removeEventListener('click', this.documentClick)
    console.log('DOM destroyed')
  }
};
</script>

<style scorped lang="scss">

#mur {
  height: 100%;
}

#col {
  text-align: right;
}

#content {
  min-height: calc(100vh - 70px);
}

#footer {
  background-color: rgb(52, 58, 64);
  color: white;
  padding: 5px;
}

p {
  margin: 0;
  padding: 5px;
}

.txt-opacity {
  opacity: 0.7;
}

pre {
  font-size: 16px;
  font-weight: 200;
  margin-top: 1%;
  margin: 0;
  overflow: hidden;
  white-space : pre-wrap;
  opacity: 0.9;
}

a {
  margin: 1%;
  color: black;
}

a:hover {
  text-decoration: none;
  color: black;
}

.bb-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.bgc-c {
  background-color: blue;
}

textarea {
  border-style: none;
  background-color: rgba(255, 255, 255, 0);
  resize: none;
  padding: 0px;
  overflow: hidden;
}

.div-textarea {
  background-color: rgba(214, 205, 205, 0.9);
  border-radius: 20px;
  padding: 7px;
  margin-bottom: 1%;
  display: flex;
}

textarea:focus {
  outline: none;
}

textarea:focus::placeholder {
  opacity: 0.5;
}

label {
  margin: 0;
}

label:hover {
  cursor: pointer;
}

.message-container {
  margin-bottom: 50%;
  margin-top: 5%;
  background: rgba(214, 205, 205, 0.8);
  border-radius: 10px;
  padding: 10px;
}

.p-response {
  opacity: 0.9;
  font-size: 14px;
}

.rotate {
  transform: rotate(180deg);
}

.btn-danger:hover {
  opacity: 0.7;
  transition: 0.2s;
}

.fa-thumbs-up {
  opacity: 0.7;
}

.img-size {
  width: 20px;
  height: 20px;
}

.likes-effect:hover {
  cursor: pointer;
  opacity: 0.5;
}

.click:hover {
  cursor: pointer;
}

.name-user {
  opacity: 0.7;
  font-weight: 600;
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

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  border-radius: 10px;
  z-index: 10;
}

.dropdown-content p {
  color: rgba(0, 0, 0, 0.9);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  border-radius: 10px;
}

.dropdown-content p:hover {
  background-color:  rgba(0, 105, 217,0.5);
  transition: 0.3s;
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

.main-message {
  margin-bottom: 3%;
  padding-bottom: 3%;
  font-size: 18px;
}

.name-responser {
  font-size: 14px;
}

.fa-ellipsis-h {
  opacity: 0.7;
}

.fa-ellipsis-h:hover {
  opacity: 0.5;
  cursor: pointer;
}

.btn-fa-ellipsis-h:focus {
  box-shadow: none;
}

.btn-fa-ellipsis-h:hover {
  cursor: default;
}

.btn-file {
  border-style: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-file:hover {
  opacity: 0.5;
  transition: 0.2s;
}

.btn-file:focus {
  outline: none;
}

.div-span-btn-file {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 5px;
  display: flex;
  width: 300px;
  justify-content: center;
}

.span-file {
  opacity: 0.8;
}

.btn-post-file {
  border-style: none;
  border-radius: 20px;
  background-color: transparent;
}

.btn-post-file:focus {
  outline: none;
}
</style>
