angular.module("umbraco").controller("Umbraco.PrevalueEditors.CropSizesController",
	function ($scope) {
      const vm = this;

      vm.showQualityInput = false;
      vm.formatQuality = -1;
      vm.imageFormats = [
          { "name": "Original" },
          { "name": "Bmp" },
          { "name": "Gif" },
          { "name": "Jpeg" },
          { "name": "Png" },
          { "name": "WebP", "qualityFormat": true, "quality" : 100 }
      ];

      vm.selectedFormat = vm.imageFormats[0];

	    if (!$scope.model.value) {
	        $scope.model.value = [];
	    }

      vm.getSelectedFormatLabel = function() {
          return vm.selectedFormat.name;
      };

      vm.select = function(imageFormat) {
          vm.selectedFormat = imageFormat;
          vm.showQualityInput = imageFormat.qualityFormat;
      };

      vm.updateFormatQuality = function(quality) {
          vm.selectedFormat.quality = quality === undefined || quality > 100 ? vm.formatQuality = 100 : quality < 0 ? vm.formatQuality = 0 : vm.formatQuality = quality;
      };

      vm.shouldRenderSecondaryCropInfo = function(item) {
          return item.selectedFormat !== undefined && item.selectedFormat !== vm.imageFormats[0];
      }

      vm.renderSecondaryCropInformation = function(item) {
          if (!vm.shouldRenderSecondaryCropInfo(item)) return "";
          return item.selectedFormat.qualityFormat ? '(Format: ' + item.selectedFormat.name + ' | Quality : ' + item.selectedFormat.quality + ')' : '(Format: ' + item.selectedFormat.name +  ')';
      }

      $scope.editMode = false;
      $scope.setFocus = false;

	    $scope.remove = function (item, evt) {
	        evt.preventDefault();
	        $scope.model.value = _.reject($scope.model.value, function (x) {
	            return x.alias === item.alias;
	        });
	    };

	    $scope.edit = function (item, evt) {
          evt.preventDefault();
          $scope.editMode = true;
          $scope.setFocus = false;

	        $scope.newItem = item;
	    };

	    $scope.cancel = function (evt) {
            evt.preventDefault();
            $scope.editMode = false;
            $scope.setFocus = true;

	        $scope.newItem = null;
	    };

        $scope.change = function () {
            // Listen to the change event and set focus 2 false
            if ($scope.setFocus) {
                $scope.setFocus = false;
                return;
            }
        };

	    $scope.add = function (evt) {
            evt.preventDefault();
            $scope.newItem.selectedFormat = vm.selectedFormat;

            $scope.editMode = false;
            $scope.setFocus = true;

	        if ($scope.newItem && $scope.newItem.alias &&
                Utilities.isNumber($scope.newItem.width) && Utilities.isNumber($scope.newItem.height) &&
                $scope.newItem.width > 0 && $scope.newItem.height > 0) {

              const exists = _.find($scope.model.value, function (item) { return $scope.newItem.alias === item.alias; });

	            if (!exists) {
                  $scope.newItem.selectedFormat = vm.selectedFormat;
	                $scope.model.value.push($scope.newItem);
	                $scope.newItem = {};
                    $scope.hasError = false;
                    $scope.cropAdded = false;
	                return;
                }
                else{
                    $scope.newItem = null;
                    $scope.hasError = false;
                    return;
                }
	        }

	        //there was an error, do the highlight (will be set back by the directive)
	        $scope.hasError = true;
        };

        $scope.createNew = function (event) {
            if (event.keyCode == 13) {
                $scope.add(event);
            }
        };

        $scope.sortableOptions = {
            axis: 'y',
            containment: 'parent',
            cursor: 'move',
            tolerance: 'pointer'
        };

	});
