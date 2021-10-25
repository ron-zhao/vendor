<style lang="sass" scoped>

</style>

<template>
    <transition>
        <keep-alive :max="5" :exclude="excludeName" :include="includeName">
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>

<script>
    function parseMatched (matched) {
        return matched[matched.length - 1].components.default.name;
    }

    export default {
        name: 'KeepAliveBox',
        data () {
            const { meta, matched } = this.$route;
            const includeName = meta.keepAlive ? [parseMatched(matched)] : [];
            return {
                includeName,
                excludeName: []
            };
        },
        watch: {
            '$route' (to, from) {
                if (to.meta.keepAlive && (to.name === 'Home' || from.name)) {
                    const matchedName = parseMatched(to.matched);
                    if (this.includeName.indexOf(matchedName) === -1) {
                        console.log('[KA] push keep-alive: ', matchedName);
                        this.includeName.push(matchedName);
                    } else {
                        console.log('[KA] splice keep-alive after: ', matchedName);

                        this.includeName.splice(
                            this.includeName.indexOf(matchedName) + 1,
                            this.includeName.length
                        );
                    }
                }
            }
        }
    };
</script>
