<template>
    <div v-if="this.userIdNow === userId" ref="dropdownDiv" class="dropdown">
        <div @click="visible" class="btn-fa-ellipsis-h btn p-0"><i class="fas fa-ellipsis-h fa-lg"></i></div>
        <div ref="dropdownMenu" class="dropdown-content d-none">
            <p @click="$emit('modify')" class="font-weight-bold txt-opacity">Modifier</p>
            <p @click="$emit('delete')" class="font-weight-bold txt-opacity">Supprimer</p>
        </div>   
    </div>
    <div v-else ref="dropdownDiv" class="dropdown">
        <div @click="visible" class="btn-fa-ellipsis-h btn p-0"><i class="fas fa-ellipsis-h fa-lg color"></i></div>
        <div ref="dropdownMenu" class="dropdown-content d-none">
            <p @click="$emit('admin-delete')" class="font-weight-bold txt-opacity">Supprimer</p>
        </div>   
    </div>
</template>

<script>
export default {
    name: "Dotes",
    props: ["userId"],
    data() {
      return {
        userIdNow: parseInt(sessionStorage.getItem('userId')),
        isAdmin: parseInt(sessionStorage.getItem('isAdmin'))
      }
    },
    methods: {
        visible() {
            this.$refs.dropdownMenu.classList.toggle('d-none')
        },
        documentClick(e) {
          let target = e.target
          if(this.$refs.dropdownDiv && !this.$refs.dropdownDiv.contains(target)) {
            this.$refs.dropdownMenu.classList.add('d-none')
          }
        }
    },
    created() {
      document.addEventListener('click', this.documentClick)
      console.log('documentClick listen')
    },
    destroyed () {
      document.removeEventListener('click', this.documentClick)
      console.log('documentClick removed')
    }
}
</script>

<style scoped>
p {
  margin: 0;
  padding: 5px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  right: -10px;
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

.color {
  color: rgba(0, 105, 217,1);
}

.dropdown-content p:hover {
  background-color:  rgba(0, 105, 217,0.5);
  transition: 0.3s;
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

.txt-opacity {
  opacity: 0.7;
}
</style>