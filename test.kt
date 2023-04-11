interface ApiInterface {
    @Headers("Content-Type:application/json")
    @POST("signup")
    fun signup(@Body info: SignUpBody): retrofit2.Call<ResponseBody>

}
class RetrofitInstance {
    companion object {
        val BASE_URL: String = "https://graduation-project-nrnm.onrender.com"

        val client: OkHttpClient = OkHttpClient.Builder().build()
        fun getRetrofitInstance(): Retrofit {
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
    }
}