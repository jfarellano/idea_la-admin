<template>
<section>
    <Header></Header>
    <div class="main-container container-fluid">
        <h1>Admin</h1>
        <router-link tag="b-button" class="button" to="/users">
            <font-awesome-icon icon="users" /> Usuarios
        </router-link>
    </div>
</section>
</template>

<script>
import Header from './Header'
export default {
    components: {
        Header
    },
    data(){
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.main-container{
    margin-top: 90px;
}
</style>


