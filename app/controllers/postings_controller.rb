class PostingsController < ApplicationController
  # respond_to :json

  def home
    @postings = Posting.order(date_posted: :desc).limit(50)
    # render component: 'SearchPostings', props: { postings: postings }
  end

  def search
    north_lat = params['northLat'].to_f
    south_lat = params['southLat'].to_f
    east_lon = params['eastLon'].to_f
    west_lon = params['westLon'].to_f
    results = Posting.where('latitude < ? AND latitude > ? AND longitude > ? AND longitude < ?', north_lat, south_lat, west_lon, east_lon)
    if params['scope'] == 'volunteer'
      results = results.where(scope: 'volunteer');
    end
    render json: { status: :success, results: results }
  end

  def new
  end

  def create
    posting_params = JSON.parse(params[:posting])

    if posting_params['address'].present? && posting_params['lat'].blank?
      lat, lon = get_location(posting_params['address'])
      posting_params[:latitude] = lat
      posting_params[:longitude] = lon
    end
    
    posting = Posting.create posting_params

    if params[:photo].present?
      posting.photo = params[:photo]
      posting.image_src = posting.photo.url
    end

    redirect_url = params[:submit_type] == 'submit-btn' ? root_url : new_posting_path

    if posting.save
      render json: { status: :success, posting: posting, redirect_url: redirect_url }
    else
      render json: { status: :unprocessable_entity, errors: posting.errors.full_messages }
    end
  end


  private

  def get_location(address)
    address_uri_encoded = URI.escape(address)
    url = "https://maps.googleapis.com/maps/api/geocode/json?address=#{address_uri_encoded}&key=#{ENV['google_geocoder_api_key']}"
    response = HTTParty.get(url)
    if response['results'] && response['results'][0]
      location = response['results'][0]['geometry']['location']
      return location['lat'].to_f, location['lng'].to_f
    end
  end
end
