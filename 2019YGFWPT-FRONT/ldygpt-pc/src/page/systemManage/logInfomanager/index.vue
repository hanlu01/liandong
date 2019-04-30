<template>
    <div>
        index页面

    </div>
</template>

<script>
    export default {
        name: 'logInfomanager',
        data() {
            return {
                data2: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1'
                    },
                        {
                            id: 11,
                            label: '二级 1-1'
                        },
                        {
                            id: 12,
                            label: '二级 1-1'
                        }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                ids: [4, 7],
                selectTree: []
            }
        },
        mounted() {
            this.getTree()
        },
        methods: {
            getChild(item) {
                let newNode = []
                item.children.forEach(i => {
                    if (this.ids.includes(i.id)) {
                        newNode.push(i)
                    }
                });
                if (newNode.length > 0) {
                    item.children = newNode
                    this.selectTree.push(item)

                }

            },
            getTree() {
                this.data2.forEach(item => {
                    this.getChild(item)
                })
                console.log(JSON.stringify(this.selectTree))
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
