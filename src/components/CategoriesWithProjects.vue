<template>
    <div id="categorieswithprojects">
        <div class="well">
            <!-- OVHD, NETW, PROSP, FULF, REND, TRAVEL -->

            <span v-for="(category, categoryIndex) in this.categoriesWithProjects" :key="categoryIndex" class="category">
                <label for="projectSelectedInCategory">{{ categoryIndex }}</label> <br>
                <select id = "projectSelectedInCategory" name="projectSelectedInCategory[]" v-model="projectSelectedInCategory[categories.indexOf(categoryIndex)]"
                        @change="onChangeProject(categories.indexOf(categoryIndex),$event)" >
                    <option value="0" selected="selected"> No choice </option>
                    <option v-for="(project, projectId) in category" :key="projectId"
                            v-bind:value="project.id" >{{ project.name }}</option>
                </select>&nbsp;
            </span>
            <span class="category"><label for="objectiveId">Strategic objective</label><br>
                <select id="objectiveId" name="objectiveId" v-model="objectiveId"
                        @change="onChangeObjective($event)" >
                    <option value="0" selected="selected"> No choice </option>
                    <option v-for="(objective, objectiveId) in objectives" :key="objectiveId"
                            v-bind:value="objective.id">{{ objective.name }}</option>
                </select>
            </span>
        </div>

    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "categories-with-projects",

        props: ['updateKey'],

        data() {
            return {
                "categoriesWithProjects": {},
                "categories": [],
                "projectSelectedInCategory": [],
                "objectives": {},
                "objectiveId": 0
            }
        },

        watch: {
            updateKey: function () {
                this.projectSelectedInCategory = this.$attrs.data.entryData.projectIds;
            }
        },

        methods: {
            onChangeProject:function(categoryIndex, event){
                for (var categoryId in this.projectSelectedInCategory) {
                    this.projectSelectedInCategory[categoryId] = +0;
                }
                this.projectSelectedInCategory[categoryIndex] = +event.target.value;
                this.$emit('prj-selected', this.projectSelectedInCategory);
            },
            onChangeObjective:function(event){
                const theObjectiveId = +event.target.value;
                this.$emit('obj-selected', theObjectiveId);
            },
        },
        created: function() {
            // this will only work when a served from a webserver
            let url = 'http://localhost:8080/timesheetrest/categoriesWithProjects';

            axios.get(url, { withCredentials: true })
                .then( (response) => {
                    this.categoriesWithProjects = response.data;
                    for ( let categoryId in this.categoriesWithProjects ) {
                        this.categories.push(categoryId);
                        // this.projectSelectedInCategory.push(0); // NEEDED Anyway?
                    }
                });

            url = 'http://localhost:8080/timesheetrest/objectives';

            axios.get(url, { withCredentials: true })
                .then( (response) => {
                    this.objectives = response.data;
                });
        }
    }
</script>

<style scoped>
    select, label {
        margin-left: 0.5em;
    }
</style>