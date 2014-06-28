/**
 * Created by it on 6/23/2014.
 */
/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'ngBoilerplate.importAthlete', [
    'ui.router', 'ngTable'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config( $stateProvider, $httpProvider ) {
        $stateProvider.state( 'importAthlete', {
            url: '/importAthlete',
            views: {
                "main": {
                    controller: 'ImportAthleteCtrl',
                    templateUrl: 'importAthlete/importAthlete.tpl.html'
                }
            },
            data:{ pageTitle: 'Importar Atletas' }
        });

        //$httpProvider.defaults.useXDomain = true;
        //Remove the header used to identify ajax call  that would prevent CORS from working
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.headers.post["Content-Type"] = "application/json";
        //delete $http.defaults.headers.common['X-Requested-With'];
    })

/**
 * And of course we define a controller for our route.
 */
    .controller( 'ImportAthleteCtrl',function ImportAthleteController( $scope, ngTableParams, $filter, $http ) {

        var dataToUpload = [];
        var dataStringtified = "";
        $scope.showContent = function($fileContent){
            var dataContent = $fileContent;
            $scope.content = dataContent;
            dataToUpload.push({ athlete: dataContent});
            console.log(dataToUpload);
        };
        $scope.uploadInfo = function(){
            jQuery.fn.justtext = function() {
                return $(this).clone()
                    .children()
                    .remove()
                    .end()
                    .text();

            };

            //var dataStringify = JSON.stringify(dataToUpload);
            //var myJsonString = JSON.stringify({ athlete : [{'name' : 'Francisco Barquero Pa', 'gender' : 'M', 'weight': 64.9,'born_date' : '06-14-2014' , 'elite': 0, 'belt_belt_id' : 2, 'academy_academy_id' : 1}]});
            //var test = { athlete : [{'name' : 'Francisco Barquero Pa', 'gender' : 'M', 'weight': 64.9,'born_date' : '06-14-2014' , 'elite': 0, 'belt_belt_id' : 2, 'academy_academy_id' : 1}]};

            //$http({method: 'GET', url: 'http://localhost:8000/tournament_manager_api/tkd_tournament_api/athlete/athletes', data:dataToUpload}).
            $http(
                {method: 'POST',
                    url: 'http://localhost:8000/tournament_manager_api/tkd_tournament_api/athlete.json',
                    dataType: 'json',
                    data: dataToUpload[0],
                    headers: {'Content-Type': 'application/json'}}
            ).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        };
        /*$('input[type=file]').change(function () {
            var file = this.files[0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = function (evt) {
                    //document.getElementById("fileContents").innerHTML = evt.target.result;
                    $scope.fileContent=evt.target.result;
                };
                reader.onerror = function (evt) {
                    document.getElementById("fileContents").innerHTML = "error reading file";
                };
            }
        });*/

        var data = [
        ];
        $scope.data = data;

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            filter: {
                //name: 'M'       // initial filter
            },
            sorting: {
                //name: 'asc'     // initial sorting
            }
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var filteredData = params.filter() ?
                    $filter('filter')(data, params.filter()) :
                    data;
                var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    data;

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.changeSelection = function(user) {
            // console.info(user);
        };
    })

.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function(onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function(onLoadEvent) {
                    scope.$apply(function() {
                        fn(scope, {$fileContent:onLoadEvent.target.result});
                    });
                };

                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});