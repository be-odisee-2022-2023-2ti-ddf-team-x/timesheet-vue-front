<template>
    <div id="mainform">
        <input type="hidden" id="id" name="id" value="0">

        <categories-with-projects :data=$data   v-on:prj-selected="prjSelected"
                                                v-on:obj-selected="objSelected" :updateKey="componentKey"> </categories-with-projects>
        <div class="form-group">
            <label for="entryDatum">Date:&nbsp;</label><input type="date" id="entryDatum" name="entryDatum"
                                             v-model="entryData.entryDatum" placeholder="2020-01-25" > &nbsp;

            <label for="startTime">From:&nbsp;</label><input type="time" id="startTime" name="startTime"
                                             v-model="entryData.startTime" placeholder="15:12"> &nbsp;

            <label for="endTime">To:&nbsp;</label><input type="time" id="endTime" name="endTime"
                                           v-model="entryData.endTime" placeholder="15:28"> &nbsp;

        </div>
        <div class="form-group">
            <label for="description">Description:&nbsp;</label><input type="text" style="width: 40em"
                                                    v-model="entryData.description" id="description" name="description"
                                                    placeholder="wandelen + winkelen + brood halen">
        </div>
        <div class="form-group">
            <div style="float: left">
                <button v-if="entryData.id==0" type="button" class="btn btn-success btn-md"
                        name="startnow" style="float: left; margin-right: 1em"
                        v-on:click="setTimeFromNow" >Start=Now</button>
                <button type="button" class="btn btn-success btn-md" name="endnow" style="float: left; margin-right: 1em"
                        v-on:click="setTimeToNow">End=Now</button>
                <button v-if="entryData.id==0" type="submit" class="btn btn-primary btn-md"
                        v-on:click="submitForm"  name="submit" style="float: left; margin-right: 1em">Create entry</button>
                <button v-if="entryData.id!=0" type="submit" class="btn btn-primary btn-md"
                        v-on:click="submitForm"  name="update" style="float: left; margin-right: 1em">Update entry</button>
                <button v-if="entryData.id!=0" type="button" class="btn btn-danger btn-md"
                        v-on:click="deleteEntry"  name="delete" style="float: left; margin-right: 1em">Delete entry</button>
                <button v-if="entryData.id!=0" type="button" class="btn btn-warning btn-md"
                        v-on:click="newForm"  name="cancel" style="float: left; margin-right: 1em">Cancel</button>
                <div style="clear: both"></div>
            </div>
            <div style="clear: both"></div>
        </div>
        <div class="well" >
            <span v-html="message"></span>
        </div>
        <entries-table v-bind:entryDatum="entryData.entryDatum" :updateKey="componentKey"></entries-table>
    </div>
</template>

<script>
    import moment from "moment";
    import axios from "axios";
    import CategoriesWithProjects from "./CategoriesWithProjects";
    import EntriesTable from "./EntriesTable";

    export default {
        name: "main-form",
        components: {CategoriesWithProjects, EntriesTable},
        data() {
            return {
                        "entryData": {
                            "id": 0,
                            "entryDatum": moment().format('YYYY-MM-DD'),
                            "startTime": moment().format('HH:mm'),
                            "endTime": moment().format("HH:mm"),
                            "projectIds": [],
                            "objectiveId": 0,
                            "description": "Wandelen in het park",
                        },
                        "message": "Please, enter a timesheet entry",
                        "componentKey": 0,
                    };
        },
        created() {
            let url;

            if (this.$route.params.entryId != null) { // edit existing
                url = 'http://localhost:8080/timesheetrest/editentrydata?id='+this.$route.params.entryId;
                this.message = "Update or Delete this entry please - or Cancel";
            } else { // create new
                url = 'http://localhost:8080/timesheetrest/newentrydata';
            }

            axios.get(url, { withCredentials: true })
                .then( (response) => {
                    this.entryData = response.data;
                    this.componentKey += 1;
                })
                .catch(function (error) {
                    console.log(error)
                });
        },
        methods: {
            prjSelected: function(selection) {
                this.entryData.projectIds = selection;
                this.message = "Projects "+ this.entryData.projectIds +" selected";
            },
            objSelected: function(selection) {
                this.entryData.objectiveId = selection;
                this.message = "Objective "+ this.entryData.objectiveId +" selected";
            },
            setTimeFromNow: function() {
                this.entryData.entryDatum = moment().format('YYYY-MM-DD');
                this.entryData.startTime = moment().format('HH:mm');
            },
            setTimeToNow: function() {
                this.entryData.entryDatum = moment().format('YYYY-MM-DD');
                this.entryData.endTime = moment().format('HH:mm');
            },
            submitForm: function () {
                const url = 'http://localhost:8080/timesheetrest/processEntry';
                const headers = {
                    withCredentials: true
                };

                axios.post(url, this.entryData, headers)
                    .then( (response) => {
                        this.message = response.data;
                        this.componentKey += 1;
                        this.entryData.startTime = this.entryData.endTime;
                        this.entryData.endTime = moment().format('HH:mm');
                        if (this.entryData.id != 0) {
                            this.entryData.id = 0; // klaar voor nieuwe entry nu
                            this.newForm();
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    });
            },
            deleteEntry: function () {
                const url = 'http://localhost:8080/timesheetrest/deleteEntry';
                const headers = {
                    withCredentials: true
                };

                axios.post(url, this.entryData, headers)
                    .then( (response) => {
                        this.message = response.data;
                        this.componentKey += 1;
                        this.newForm();
                        /*
                        this.entryData.startTime = this.entryData.endTime;
                        this.entryData.endTime = moment().format('HH:mm');
                        if (this.entryData.id != 0) {
                            this.entryData.id = 0; // klaar voor nieuwe entry nu
                            this.newForm();
                        }

                         */
                    })
                    .catch(function (error) {
                        console.log(error)
                    });

            },
            newForm: function () {
                // redirect for newEntryData but after some delay
                setTimeout( () => this.$router.push({ name : 'Timesheet2'}, () => { this.$router.go() } ), 1200);
            }
        },
    }
</script>

<style scoped>
    input {
        margin-left: 0.5em;
    }
</style>