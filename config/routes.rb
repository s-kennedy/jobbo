Rails.application.routes.draw do
  root to: 'postings#home'
  get '/search', to: 'postings#search', as: 'search'
  resources :postings
end
