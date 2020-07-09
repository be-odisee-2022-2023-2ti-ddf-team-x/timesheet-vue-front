<template>
    <div class="table-striped well">
        <div class="row"> {{ entryDatum }} </div>
        <div v-for="entry in this.entriesFromDate" v-bind:key="entry" class="row">
            <div class="col-md-1 text-left" >
                {{ entry.dateTimeFrom | formatHhMm }}
            </div>
            <div class="col-md-1 text-left">
                {{ entry.dateTimeTo | formatHhMm }}
            </div>
            <div class="col-md-1 text-left" >
                {{ entry.duration | parseISO8610Duration }}
            </div>
            <div class="col-md-1 text-left" >
                {{ entry.project.category.name }}
            </div>
            <div class="col-md-1 text-left" >
                {{ entry.project.name }}
            </div>
            <div class="col-md-5 text-left">
                {{ entry.description }}
            </div>
            <div class="col-md-2 text-left">
                {{ entry.objective != null ? entry.objective.name : "" }}
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    // async/await is niet zo goed als Promises, maar bruikbaar hier
    async function getEntriesFromDate(entryDatum)  {

        //let result = null;
        // this will only work when a served from a webserver
        let url = 'http://localhost:8080/timesheetrest/entriesFromDate?entryDatum=' + entryDatum;

        let result = (await axios.get(url, {withCredentials: true})).data;

        return result;
    }

    export default {
        name: "EntriesTable",

        props: ['entryDatum', 'updateKey'],

        data() {
            return {
                "entriesFromDate": []
            }
        },

        created: function() {
            var result = getEntriesFromDate(this.entryDatum);
            result.then((res) => this.entriesFromDate = res)
        },

        watch: {
            updateKey: function () {
                var result = getEntriesFromDate(this.entryDatum);
                result.then((res) => this.entriesFromDate = res)
            }
        },

        filters: {

            formatHhMm: function(datetimestampstring) {
                let hours = (new Date(datetimestampstring)).getHours();
                let hoursStr = hours < 10 ? '0'+hours.toString() : hours.toString();
                let minutes = (new Date(datetimestampstring)).getMinutes();
                let minutesStr = minutes < 10 ? '0'+minutes.toString() : minutes.toString();
                return hoursStr+":"+minutesStr;
            },

            parseISO8610Duration: function(iso8601Duration) {
                var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
                var matches = iso8601Duration.match(iso8601DurationRegex);

                let parsedResult = {
                    sign: matches[1] === undefined ? '+' : '-',
                    years: matches[2] === undefined ? 0 : matches[2],
                    months: matches[3] === undefined ? 0 : matches[3],
                    weeks: matches[4] === undefined ? 0 : matches[4],
                    days: matches[5] === undefined ? 0 : matches[5],
                    hours: matches[6] === undefined ? 0 : matches[6],
                    minutes: matches[7] === undefined ? 0 : matches[7],
                    seconds: matches[8] === undefined ? 0 : matches[8]
                };

                // we zijn alleen maar in uren en minuten geïnteresseerd
                let hours = parsedResult['hours'];
                let hoursStr = hours < 10 ? '0'+hours.toString() : hours.toString();
                let minutes = parsedResult['minutes'];
                let minutesStr = minutes < 10 ? '0'+minutes.toString() : minutes.toString();
                return hoursStr+":"+minutesStr;
            }
        }
    }
</script>

<style scoped>

</style>