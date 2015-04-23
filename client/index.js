'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://daytrippin.firebaseio.com/');
}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', '$http', function($scope, $firebaseObject, $firebaseArray, $http){
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;
  
  var fbPortfolios = $scope.fbRoot.child('portfolios');
  var afPortfolios = $firebaseArray(fbPortfolios);
  $scope.portfolios = afPortfolios;
  
  $scope.addUser = function(){
    $scope.user.$save();
    $scope.swapBar();
  };
  $scope.swapBar = function(){
    $scope.setupBar = true;
  };
  $scope.addPortfolio = function(){
    $scope.portfolios.$add($scope.portfolio);
  };
  $scope.buyShares = function(index){

    //var symbol = $scope.portfolio.stock.symbol;
    var shares = $scope.portfolio.stock.amount;

    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ $scope.portfolio.stock.symbol +'&callback=JSON_CALLBACK').then(function(response){
    //console.log(response.data.LastPrice);
        
        
      if((response.data.LastPrice * shares) < $scope.user.capital){
        $scope.user.capital -= (response.data.LastPrice * shares);
        
        $scope.stock = {};
        //$scope.stock.name = index;
        $scope.portfolio.stock.shares = shares;
        //$scope.portfolio.stock.symbol = symbol;
        $scope.portfolio.stock.price = response.data.LastPrice;
        $scope.portfolio.stock.position= (response.data.LastPrice * shares);
        console.log($scope.stock);
        $scope.portfolios.$add($scope.stock);
        //$scope.portfolios['0'].$add(stock.price);
        //$scope.portfolio.name.$add($scope.stock.symbol);
        //console.log(shares);
      }else{
        alert('Not Enough Funds');
      }
    });
  };
  
}]);
