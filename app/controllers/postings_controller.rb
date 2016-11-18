class PostingsController < ApplicationController
  # respond_to :json

  def search
    render component: 'SearchPostings'
  end

  def new
    render component: 'AddPosting'
  end

  def create
    posting_params = JSON.parse(params[:posting])
    posting = Posting.create posting_params
    posting.photo = params[:photo]

    if posting.save
      render json: { status: :success, posting: posting }
    else
      render json: { status: :unprocessable_entity, errors: posting.errors.full_messages }
    end
  end
end
