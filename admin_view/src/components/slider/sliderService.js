function sliderService(token) {

    this.addSlider = function(slider) {
        return axios({
            method: "POST",
            url: "http://localhost:5000/api/v1/slider",
            data: slider,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
    };

    this.getSliderList = function() {
        return axios({
            method: "GET",
            url: "http://localhost:5000/api/v1/slider",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    this.deleteSlider = function(id) {
        return axios({
            method: "DELETE",
            url: `http://localhost:5000/api/v1/slider/${id}`,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    this.getSliderById = function(id) {
        return axios({
            method: "GET",
            url: `http://localhost:5000/api/v1/slider/${id}`,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
    };

    this.updateSliderById = function(id, slider) {
        return axios({
            method: "PATCH",
            url: `http://localhost:5000/api/v1/slider/${id}`,
            data: slider,
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
    };
}