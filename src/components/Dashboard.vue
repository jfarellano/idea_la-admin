<template>
<section>
    <Header></Header>
    <div class="main-container container-fluid">
        <h1>Test text</h1>
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


