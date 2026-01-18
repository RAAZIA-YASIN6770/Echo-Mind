"""
Quick Connection Test Script
Tests backend API endpoints to verify they're working
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test a single endpoint"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Method: {method} | URL: {url}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ SUCCESS")
            try:
                print(f"Response: {json.dumps(response.json(), indent=2)}")
            except:
                print(f"Response: {response.text[:200]}")
        else:
            print(f"❌ FAILED")
            print(f"Response: {response.text[:200]}")
            
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("❌ CONNECTION ERROR - Is the server running?")
        return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def main():
    print("\n" + "="*60)
    print("🔍 ECHOMIND BACKEND CONNECTION TEST")
    print("="*60)
    print("\nMake sure Django server is running on http://localhost:8000")
    print("Run: python manage.py runserver")
    print("\nStarting tests in 3 seconds...")
    
    import time
    time.sleep(3)
    
    results = []
    
    # Test 1: API Root
    results.append(test_endpoint(
        "GET", 
        "/", 
        description="API Root - Welcome Message"
    ))
    
    # Test 2: Health Check
    results.append(test_endpoint(
        "GET", 
        "/api/health/", 
        description="Health Check Endpoint"
    ))
    
    # Test 3: Gamification API Root
    results.append(test_endpoint(
        "GET", 
        "/api/gamification/", 
        description="Gamification API Root"
    ))
    
    # Test 4: Get Streak
    results.append(test_endpoint(
        "GET", 
        "/api/gamification/streak/", 
        description="Get User Streak"
    ))
    
    # Test 5: Get Tree State
    results.append(test_endpoint(
        "GET", 
        "/api/gamification/tree/state/", 
        description="Get Knowledge Tree State"
    ))
    
    # Test 6: Chat Endpoint
    results.append(test_endpoint(
        "POST", 
        "/api/chat/", 
        data={"message": "Hello, this is a test!"},
        description="Chat with Socratic Engine"
    ))
    
    # Test 7: Get User Badges
    results.append(test_endpoint(
        "GET", 
        "/api/gamification/achievements/badges/", 
        description="Get User Badges"
    ))
    
    # Test 8: Get Daily Challenge
    results.append(test_endpoint(
        "GET", 
        "/api/gamification/challenges/daily/", 
        description="Get Daily Challenge"
    ))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    passed = sum(results)
    total = len(results)
    print(f"\nPassed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Backend is working perfectly!")
    elif passed > 0:
        print(f"\n⚠️ Some tests passed. Check failed endpoints above.")
    else:
        print("\n❌ All tests failed. Make sure the server is running!")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
