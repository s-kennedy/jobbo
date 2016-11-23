module Utils
  class JobBankPostingScraper
    class ScraperError < StandardError; end

    def initialize(page_url)
      @page = Nokogiri::HTML(open(page_url))
      @job_data = { source: page_url }
      @jobbank_id = jobbank_id(page_url)
    end

    def get_data
      raise ScraperError, "Already scraped and saved job posting with ID #{@jobbank_id}" if job_posting_exists?

      @employer = get_employer
      @address = get_address

      additional_methods_to_call = [:get_job_title, :get_location, :get_salary, :get_schedule, :get_description, :get_email_address, :get_phone_number, :get_date_to_remove, :get_date_posted]

      additional_methods_to_call.each { |method| self.send(method.to_sym) }

      @job_data
    end

    def jobbank_id(page_url)
      id = page_url.split('&id=')[1].split('&')[0]
      @job_data[:jobbank_id] = id
      id
    end

    def get_job_title
      title = @page.css('h2.title').children.text
      raise ScraperError, "Unable to find job title for posting with ID #{@jobbank_id}" if title.blank?
      @job_data[:title] = title.capitalize
    end

    def get_employer
      employer = employer_with_link
      employer = employer_without_link if employer.blank?

      raise ScraperError, "Unable to find employer for posting with ID #{@jobbank_id}" if employer.blank?

      @job_data[:employer] = employer
      employer
    end

    def employer_with_link
      node = @page.css('div.job-posting-details p.date-business span.business span span')
      employer = node.text.strip if node.present?
      employer
    end

    def employer_without_link
      node = @page.css('div.job-posting-details p.date-business span.business')
      if node.present? && node.text.include?('Employer Details')
        text = node.text.split('Employer Details')[1]
      else 
        text = node.text
      end
      employer = text.strip if text.present?
      employer
    end

    def get_date_posted
      date_string = @page.css('div.job-posting-details p.date-business span.date')
      date_posted = date_string.text.strip.split('Posted on ')[1] if date_string.present?
      @job_data[:date_posted] = DateTime.parse(date_posted)
    end

    def get_salary
      node = @page.css('div.job-posting-details span[itemprop=baseSalary]')
      salary = node.text.strip if node.present?
      @job_data[:salary] = salary
    end

    def get_schedule
      node = @page.css('div.job-posting-details span[itemprop=specialCommitments]')
      schedule = node.text.strip if node.present?
      @job_data[:schedule] = schedule
    end

    def get_description
      node = @page.css('div.job-posting-details p[itemprop=responsibilities]')
      description = node.text.strip if node.present?
      @job_data[:description] = description
    end

    def get_email_address
      email_title = @page.css('div.job-posting-detail-apply h4:contains("By email:")')
      email_address = email_title.children.first.parent.next_element.children.text if email_title.present?
      @job_data[:email] = email_address
    end

    def get_phone_number
      phone_title = @page.css('div.job-posting-detail-apply h4:contains("By phone:")')
      phone_number = phone_title.children.first.parent.next_element.children.text if phone_title.present?
      @job_data[:phone] = phone_number
    end

    def get_address
      address_from_posting = get_address_from_posting
      address = address_from_posting.nil? ? get_address_from_employer : address_from_posting
      if address.present?
        @job_data[:address] = address
      else
        raise ScraperError, "Unable to find address for posting with ID #{@jobbank_id}"
      end
      address
    end

    def job_posting_exists?
      Posting.where(jobbank_id: @jobbank_id).present?
    end

    def get_date_to_remove
      date_title = @page.css('div.job-posting-detail-apply h4:contains("Advertised until:")')
      if date_title.present?
        date_string = date_title.children.first.parent.next_element.text
        DateTime.parse(date_string) + 1.day
      end
    end

    def get_address_from_posting
      location_title = @page.css('div.job-posting-detail-apply h4:contains("Job Location:")')
      location_title.children.first.parent.next_element.text if location_title.present?
    end

    def get_address_from_employer
      url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{@employer}&key=#{ENV['google_places_api_key']}"
      response = HTTParty.get(url)

      response['results'][0]['formatted_address'] if response['results'] && response['results'][0]
    end

    def get_location
      address_uri_encoded = URI.escape(@address)
      url = "https://maps.googleapis.com/maps/api/geocode/json?address=#{address_uri_encoded}&key=#{ENV['google_geocoder_api_key']}"
      response = HTTParty.get(url)
      if response['results'] && response['results'][0]
        location = response['results'][0]['geometry']['location']
        @job_data[:latitude] = location['lat'].to_f
        @job_data[:longitude] = location['lng'].to_f
      else
        raise ScraperError, "Unable to find location for posting with ID #{@jobbank_id}"
      end
    end

  end
end