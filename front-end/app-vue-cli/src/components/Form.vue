<template>
    <form @submit.prevent="" enctype="multipart/form-data">
        <div class="div-textarea">
          <label class="visible" :for="messageId">Textarea</label>
          <textarea
              :id="messageId"
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
          >
          </textarea>
        </div>
    </form>
</template>

<script>
import axios from 'axios'
export default {
    name: "Form",
    props: ["messageId"],
    methods: {
        updateTextareaHeight(e) {
            let target = e.currentTarget
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
        },
        textResponse(e) {
          let target = e.target
          if (e.keyCode == 13 && !e.shiftKey) {
            const data = new FormData();
            data.append('response', target.value)
            data.append('messageId', this.messageId)
            axios
                .post("http://localhost:5000/message/response", data)
                .then(() => {
                  console.log("Réponse envoyé !");
                  this.$emit('post-response-done')
                })
                .catch((err) => {
                  console.log(err.response.data);
                });

            target.value = null
            this.updateTextareaHeight(e)       
            e.preventDefault();
          }
        },
    }
}
</script>

<style scoped>
textarea {
  border-style: none;
  background-color: rgba(255, 255, 255, 0);
  resize: none;
  padding: 0px;
  overflow: hidden;
}

textarea:focus {
  outline: none;
}

textarea:focus::placeholder {
  opacity: 0.5;
}

.visible {
  z-index: -5;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
}

.div-textarea {
  background-color: rgba(214, 205, 205, 0.9);
  border-radius: 20px;
  padding: 7px;
  margin-bottom: 1%;
  display: flex;
}
</style>