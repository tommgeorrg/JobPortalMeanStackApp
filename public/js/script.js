var app = angular.module("myapp", ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider.when("/", {
        templateUrl: 'views/login.html',
        controller: 'mainController'
    })

    .when("/registration",{
        templateUrl: "views/registration.html",
        controller: 'signupController'
    })

    .when("/home",{
        templateUrl: "views/home.html",
        controller: 'homeController'
    })

    .when('/jobpage',{
        templateUrl: "views/jobpage.html"
    })

});

app.controller('mainController', function($scope, $location, $http){

    $scope.signup=function(){
        $location.path('/registration');
    }

    $scope.submit = function(user){
        console.log(user);

        $http.post('http://localhost:8003/login', $scope.user).then(function(response){
            console.log(response);
        

        if(!response.data.success){
            alert("Invalid Details!!");
            $location.path("/");
        }
        else{
            $location.path("/home");
        }
        

        })

    }

});

app.controller('signupController', function($scope, $http, $location){
    $scope.Register = function(newUser){
        console.log(newUser)
        $http.post('http://localhost:8003/createuser', $scope.newUser).then(function(resolve){
            console.log(resolve.data);
        });
    
        $location.path('/');
    }

});

// Using service, so that the login details can be accessed in all of the pages
app.service("loginservice", function($http, $rootScope){ 
     
var service = {};
service.isLoggedIn = function(){
    $http.post('http://localhost:8003/getUser').then(function(data){
        console.log(data); // This data is a result which contains lots of stuffs like http and other associations.
    if(data){
    $rootScope.userdata = data.data.data;
    $rootScope.usertype = data.data.data.usertype;
    $rootScope.username = data.data.data.username;
    console.log('In service');
    console.log($rootScope.username);
} else{
    console.log("error");
}
}); 

}


console.log(service);
return service;
});


app.controller("homeController", function(loginservice, $rootScope, $scope, $http, $location){
loginservice.isLoggedIn();
console.log($rootScope.username);

// Using $http.put for updating the isLoggedIn value to false of the user which logs out and writing the query in the db to set the isLoggedIn value from true to false
$scope.logout = function(){
    $http.put('http://localhost:8003/logout', $scope.userdata).then(function(resolve){
        console.log(resolve);
        $location.path("/");
    });
}
});