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
    if($scope.portfolios.$id){
      $scope.portfolios.$save($scope.portfolio).then(function(){
        $scope.calcFunds();
      });
    }else{
      $scope.portfolios.$add($scope.portfolio);
    }
  };
  $scope.buyShares = function(index){
    
    var shares = $scope.portfolio.stock.amount;
    
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ $scope.portfolio.stock.symbol +'&callback=JSON_CALLBACK').then(function(response){
      
      
      if((response.data.LastPrice * shares) < $scope.user.capital){
        $scope.user.capital -= (response.data.LastPrice * shares);
        
        $scope.stock = {};
        $scope.portfolio.stock.shares = shares;
        $scope.portfolio.stock.price = response.data.LastPrice;
        $scope.portfolio.stock.position= (response.data.LastPrice * shares);
        console.log($scope.stock);
        $scope.portfolios.$add($scope.stock);
        $scope.user.$save($scope.user.capital);
      
      }else{
        alert('Not Enough Funds');
      }
    });
  };
  $scope.sellShares = function(stock){
    $scope.stock.$remove(stock).then(function(){
      $scope.user.capital += (stock.price * stock.shares);
      //$scope.portfolio.$remove(stock);
      $scope.user.$save($scope.user.capital);
    });
  };
}]);
